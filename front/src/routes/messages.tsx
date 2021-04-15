import React from 'react';
import MessageRow from '../components/MessageRow';
import '../styles/MessagesRouter.scss';
import TextareaAutosize from 'react-textarea-autosize';
import Preloader from '../components/Preloader';
import { connect, ConnectedProps } from 'react-redux';
import { RootState } from '../redux/rootReducer';
import { AppUpdateLoadingAction, AppUserDataAction, AppUserFriendListUpdateAction, InitStorageAction, InitStorageMessagesAction, MessageSelectAction, StorageMessageAdded } from '../redux/actions';
import { NavLink, RouteComponentProps } from 'react-router-dom';
import { FriendData, MessageInterface, MessageSendInterface, MessageSocketAddedInterface, ResponseDataExample, ResponseMessageData, ResponseUserData, ResponseUserFriendListData } from '../../../global/types';
import ChatRow from '../components/chatRow';
import Participants from '../components/participants';
import ModalWindowCreatedChannel from '../components/modals/modal_window_created_channel';
import ModalWindowFiles from '../components/modals/modal_window_files';
import document from '../images/document.png'
import UserProfile from '../components/UserProfile';
import { ModalWindowEnum } from '../enums'
import ModalWindowUpdateUserName from '../components/modals/modal_window_update_username';
import ModalWindowUpdateEmail from '../components/modals/modal_window_update_email';
import ModalWindowUpdatePassword from '../components/modals/modal_window_update_password';
import ModalWindowDeletePrifle from '../components/modals/modal_window_delete_profile';
import { FormattedMessage } from 'react-intl';

interface MessageRouterParams{
    ChannelID? : string
}
 
interface FileLoader{
    type : 'img' | 'document',
    result : string,
    name : string
    file : File,
}

interface UserSearch { 
    id : number,
    Url : string,
    username : string
}

interface MessageRouterStates{ 
    transitionHidden : boolean, 
    inputValue : string, 
    modalWindow? : JSX.Element 
    file? : FileLoader,
    isDragFile : boolean,
    UserProfileShow : boolean,
    UsersSearch : Array<UserSearch>,
    searchText : string,
}
 
class MessagesRouter extends React.Component<PropsFromRedux, MessageRouterStates>{

    messageInput : string = ''
    uploadMessageForChannel : boolean = false;
    windowContainer : HTMLDivElement | null | undefined;
 
    ref : HTMLDivElement | null | undefined

    constructor(props : PropsFromRedux){
        super(props);
        this.state = {
            inputValue : '',
            searchText : '',
            transitionHidden : false,
            isDragFile : false,
            UserProfileShow : false,
            UsersSearch : [],
        }

        fetch('http://localhost:8080/api/user_data',{
            credentials : 'include',
        })
        .then(res => {
            if (res.status !== 200){
                throw new Error(res.status.toString())
            }
            return res;
        }) 
        .then(res => res.json()) 
        .then((res : ResponseUserData )=> {
            if (!res.data[0]) return;
            this.props.InitStorageAction({
                users : res.data[0].Users,
                channels : res.data[0].channelsStorage
            })
 
            this.props.AppUserDataAction(res.data[0].User)
            // this
            // wtf
            setTimeout(() => {
                setTimeout(() => {
                    this.props.AppUpdateLoadingAction(!res.status)
                }, 600);
                this.setState({
                    transitionHidden : true,
                })
            },1500 - 600)
        })
        .catch(err => {
            this.props.history.push('/signin')
        });

        this.props.socket.on('add_message',(data : MessageSocketAddedInterface)  => {
            this.props.StorageMessageAdded({
                channelID : data.MessageChannelID,
                message : {
                    AuthorID : data.AuthorID,
                    id : data.id,
                    created_at : data.created_at,
                    content : data.content,
                    Url : data.Url,
                }
            })

        })

    }


    OnScrolling() {
        const scrollTop = this.ref?.scrollTop
        const channelID = (this.props.match.params as MessageRouterParams).ChannelID
        const offset = this.ref?.querySelector('.messagesContainerElements')?.children.length
        if (!scrollTop || !channelID || !offset) return;
        // TODO: added flag for checked full messages in room
        if (scrollTop < 50){
            fetch(`http://localhost:8080/api/messages/${channelID}/${offset}`,{
                credentials : 'include',
            }).then(res => res.json()).then((res : ResponseMessageData) => {
                const messages = this.props.Storage.channels[channelID]?.messages
                if (!messages) return;
                if (res.data[0].length < 1) return;
                messages.push(...res.data[0])
                this.props.InitStorageMessagesAction({
                    channelID : Number(channelID),
                    messages : messages
                })
            })
        }
    }

    GetUserDataByID(id : number){
        return this.props.Storage.users.find((value) => value.id === id)
    }

    UploadMessagesForChannel(channelID : string){
        this.uploadMessageForChannel = true
        fetch('http://localhost:8080/api/messages/' + channelID,{
            credentials : 'include',
        }).then(res => res.json()).then((res : ResponseMessageData) => {
            this.props.InitStorageMessagesAction({
                channelID : Number(channelID),
                messages : res.data[0]
            })
        })

    }

    GetMessagesForChannel(channelID : string){

        if (!this.props.Storage.channels[channelID]){
            return false
        }

        if (!this.props.Storage.channels[channelID].messages){

            this.UploadMessagesForChannel(channelID);

            return false;
        }

        return this.props.Storage.channels[channelID].messages
    }

    componentDidMount(){
        if (this.ref)
            this.ref!.scrollTop = this.ref.scrollHeight

        this.windowContainer?.addEventListener('click',(ev : MouseEvent) => {
            if (!ev.target) return;
            if (!this.state.modalWindow) return;
            if (!this.windowContainer) return;
            const modalWindow = this.windowContainer.children[0]
            if (!modalWindow.contains(ev.target as Node)){
                this.CloseModal()
            }
        })
    }

    OnSendMessage(newMessage? : string){
        const channelID = (this.props.match.params as MessageRouterParams).ChannelID
        if (!channelID) return;
        this.props.socket.emit('message_send',{
            text : newMessage || this.state.inputValue,
            file : this.state.file && {
                filename : this.state.file.name,
                file : this.state.file.file
            },
            ChannelID : Number(channelID),
        } as MessageSendInterface)

        this.setState({
            inputValue : '',
            file : undefined,
        })

        this.CloseModal()
        
    }

    GenerateHeader(messages : MessageInterface[]){
        const msgs = [...messages].sort((a,b) => a.AuthorID - b.AuthorID).filter((value,index,arr) => arr[index - 1]?.AuthorID !== value.AuthorID)
        msgs.length = 3
        return msgs.reduce((prev, current,index) =>{
            return prev + (index === 0 ? ''  : ', ') + this.GetUserDataByID(current.AuthorID)?.username
        },'')

    } 
    
    onKeyPressed(e : React.KeyboardEvent){
        if (e.key.toLowerCase() === 'enter' && !e.shiftKey){
            e.preventDefault()
            this.OnSendMessage();
        }
    }

    onChangeMessage(event : React.ChangeEvent<HTMLTextAreaElement>){
        this.setState({
            inputValue : event.currentTarget.value 
        })
    }

    componentDidUpdate(props : PropsFromRedux){
        const params_new = (props.match.params as MessageRouterParams)
        const params = (this.props.match.params as MessageRouterParams)

        if (params_new.ChannelID !== params.ChannelID){
            this.setState({
                inputValue : '',
            })
        }
        if (this.ref)
            this.ref!.scrollTop = this.ref.scrollHeight
        return true; 
    }

    OpenModal(formID : ModalWindowEnum, ...args : any){

        let modal;
        switch (formID) {
            case ModalWindowEnum.MODAL_WINDOW_CREATED_CHANNEL:
                modal = <ModalWindowCreatedChannel />
                break;
            case ModalWindowEnum.MODAL_WINDOW_FILE_ADDED:
                modal = this.state.file ? <ModalWindowFiles  
                OnSendMessage={(newMessage) => this.OnSendMessage(newMessage)} 
                CloseModal={() => this.CloseModal()}
                fileName={this.state.file.name}
                inputValue={this.state.inputValue}
                type={this.state.file.type} 
                result={this.state.file.result} /> : undefined
                break;
            case ModalWindowEnum.MODAL_WINDOW_UPDATE_USER_NAME :
                modal = <ModalWindowUpdateUserName username={args[0]} CloseModal={() => this.CloseModal()}  /> 
                break;
            case ModalWindowEnum.MODAL_WINDOW_UPDATE_EMAIL:
                modal = <ModalWindowUpdateEmail email={args[0]} CloseModal={() => this.CloseModal()} />
                break;
            case ModalWindowEnum.MODAL_WINDOW_UPDATE_PASSWORD:
                modal = <ModalWindowUpdatePassword CloseModal={() => this.CloseModal()} />
                break;
            case ModalWindowEnum.MODAL_WINDOW_DELETE_PROFILE:
                modal = <ModalWindowDeletePrifle closeModel={() => this.CloseModal()}/>
                break;
            default:
                modal = undefined
                break;
        }
        this.setState({
            modalWindow : modal
        }) 

    }

    CloseModal(){
        this.OpenModal(ModalWindowEnum.MODAL_WINDOW_NOT_VALID)
    }

    OnClickCreatedRoom(event : React.MouseEvent<HTMLDivElement, MouseEvent>){

        this.OpenModal(ModalWindowEnum.MODAL_WINDOW_CREATED_CHANNEL)

    }

    OnSendFile(file : File){
        const reader = new FileReader();
        const type = file.type.split('/')[0] === 'image' ? 'img' : 'document'
        reader.onload = (event : ProgressEvent<FileReader>) => {
            if (!event.target?.result) return;
            this.setState({
                file : {
                    type : type, 
                    result : type === 'document' ? document : event.target.result as string,
                    name : file.name,
                    file : file,
                }
            })
            this.OpenModal(ModalWindowEnum.MODAL_WINDOW_FILE_ADDED)
        };

        reader.readAsDataURL(file);

    }

    OnChangeFile(e : React.ChangeEvent<HTMLInputElement>){
        if (!e.target.files) return;
        const file = e.target.files[0] 
        if (!file) return;
        if (file.size > 16000000) return;

        this.OnSendFile(file)
        e.target.value = ''


    }
    // not working
    OnDropFile(e : React.DragEvent<HTMLDivElement>){
        e.preventDefault()
        const target = e.dataTransfer.files[0]
        if (!target || target.size > 16000000) return;
        this.OnSendFile(target)
    }

    UpdateProfileShow(state : boolean){
        this.setState({
            UserProfileShow : state,
        })
    }

    UserProfileComponent(){
        return (
            <div className="UserProfileContainer">
                {!this.props.IsLoading && <UserProfile CloseMenu={() => this.UpdateProfileShow(false)} openModal={(id : ModalWindowEnum,...args : any) => this.OpenModal(id,...args)} />}
            </div>
        )
    } 

    OnAddedInFriend(id : number){

        fetch('http://localhost:8080/api/friends/add_friend',{
            credentials : 'include',
            method : 'POST',
            headers : {
                'Content-Type' : 'application/json'
            },
            body : JSON.stringify({
                user_id : id,
            }),
        }).then(res => res.json()).then(res => { // TODO
            
        })
    }

    UserSearchComponent(username : string, urlAvatar : string,id : number){
        return (
        <div onClick={e => this.OnAddedInFriend(id)} key={'user_search_' + id} className="SearchContainerUser row">
            <div className="UserAvatarContainerSearch row">
                <img src={urlAvatar} alt=""/>
                <div className="usernameSearch row">
                    <span>{username}</span>
                </div>
            </div>
        </div>
        )
    }

    OnChangeSearchText(searchText : string){
        this.setState({
            searchText : searchText,
        })

        fetch('http://localhost:8080/api/users_search?text=' + searchText,{
            credentials : 'include',
        }).then(res => res.json()).then((res : ResponseDataExample) => {
            this.setState({
                UsersSearch : res.data[0]
            })
        })
    }

    MessagesContainer(params : MessageRouterParams,messages : false | "" | MessageInterface[] | undefined){
        return (
            <div className="row mainContent">
            <div  className="messagesContainerMain column">
                <div onScroll={() => this.OnScrolling()} ref={(e) => {this.ref = e}} className="MessagesBlocksMain">
                    <div className="column">
                        <div className="column messagesContainerElements">
                            {/* <div className="MessagesStartContainer column">
                                <img src="https://cdn.discordapp.com/avatars/603355055025815563/bd1b03dcbcf8c168b828cf59a329d62f.png?size=128" alt="2"/>
                                <span>UniBridge</span>
                                <span className="subHeader row">Это начало истории ваших сообщений с<h1>@UniBridge</h1></span>
                            </div> */}
                            {messages && messages?.sort((a,b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime()).map((messageData,index,arr) => {
                                return <MessageRow key={'message_id_' + messageData.id} messageData={messageData} IsDuplicate={arr[index -1]?.AuthorID === arr[index]?.AuthorID}/>
                            })
                            }
                        </div>
                    </div>
                </div>
                <div  className="InputMessage column">
                    <div onDrop={e => this.OnDropFile(e)} className="InputMessageBlock row">
                        <input multiple={false} onChange={(e) => this.OnChangeFile(e)} id="InputFile" hidden className="InputFile" type="file" />
                        <label htmlFor="InputFile" className="InputFile" ><svg width="24" height="24" viewBox="0 0 24 24"><path  fill="rgb(190, 190, 190)" d="M12 2.00098C6.486 2.00098 2 6.48698 2 12.001C2 17.515 6.486 22.001 12 22.001C17.514 22.001 22 17.515 22 12.001C22 6.48698 17.514 2.00098 12 2.00098ZM17 13.001H13V17.001H11V13.001H7V11.001H11V7.00098H13V11.001H17V13.001Z"></path></svg></label>
                        <TextareaAutosize value={this.state.inputValue} onChange={(e) => this.onChangeMessage(e)} onKeyDown={(e) => this.onKeyPressed(e)} tabIndex={0} spellCheck={true} placeholder="Message" maxLength={2000} className="InputText" wrap="soft"/>
                        <div className="emoji_smile_icon_vector"></div>
                    </div>
                </div>
            </div>

            {params.ChannelID && this.props.Storage.channels[params.ChannelID] 
            && <Participants channels={this.props.Storage.channels[params.ChannelID].users } />}
        </div>
        )
    }

    FriendRowComponent(id : number, username : string, avatar : string,isOnline : boolean){
        return (
        <div key={'Friend_row_' + id} className="usersContainer column">
            <div className="row FriendRow">
                <div className="row FriendRowImgContainer">
                    <img src={avatar} alt=""/>
                </div>
                <div className="column FriendName_status">
                    <span className="UsernameFriend">{username}</span>
                    <span className="UserStatusFriend"><FormattedMessage id={ !isOnline ? "Offline" : "Online"} /></span>
                </div>
            </div>
        </div>
        )
    }

    FriendsListContainer(){

        return (
            <div className="column FriendList">
                <span className="FriendsOnline"> <FormattedMessage id="Online" /> — {this.props.friends.length}</span>
                <div className="column">
                    {this.props.friends.map(friend => {
                        return this.FriendRowComponent(friend.id,friend.username,friend.Url,friend.onlinestatus)
                    })}
                </div>
            </div>
        )
    }

    LoadFriends(){
        fetch('http://localhost:8080/api/friends/friendlist?isfull=1',{
            credentials : 'include',
        }).then(res => res.json()).then((res : ResponseUserFriendListData) => {
            this.props.AppUserFriendListUpdateAction(res.data as Array<FriendData>)
        })
    }

    render(){

        const params = (this.props.match.params as MessageRouterParams)
        const messages = !this.props.IsLoading && params.ChannelID && this.GetMessagesForChannel(params.ChannelID)
 
        if (!params.ChannelID && this.props.friends && this.props.friends.length < 1){
            this.LoadFriends()
        }

        return (
            <React.StrictMode>
            {this.props.IsLoading && <Preloader transitionHidden={this.state.transitionHidden}/>}
            <div ref={(e) => {this.windowContainer = e}} className="column modalWindowContainer" data-close={!this.state.modalWindow}>
                {this.state.modalWindow}
            </div>
            {this.state.UserProfileShow && this.UserProfileComponent()}
            {/* TODO  onDrop={(e) => this.OnDropFile(e)} onDragLeave={e => this.setState({isDragFile : false})} onDragOver={e => this.setState({isDragFile : true})}*/}
            <div data-drag-file={this.state.isDragFile} className="MessagesBlock row">
                <div className="column leftElement">
                    <div className="headerBlock searchContainer row" >
                        {/* <input placeholder="Найти Беседу"/> */}
                    </div>

                    <NavLink to='/channel' className="row friendsLink" data-friendselect={!params.ChannelID}>
                        <svg className="linkButtonIcon" aria-hidden="false" width="24" height="24" viewBox="0 0 24 24"><g fill="none" fillRule="evenodd"><path id="main" fill="var(--default-color-messange)" fillRule="nonzero" d="M0.5,0 L0.5,1.5 C0.5,5.65 2.71,9.28 6,11.3 L6,16 L21,16 L21,14 C21,11.34 15.67,10 13,10 C13,10 12.83,10 12.75,10 C8,10 4,6 4,1.5 L4,0 L0.5,0 Z M13,0 C10.790861,0 9,1.790861 9,4 C9,6.209139 10.790861,8 13,8 C15.209139,8 17,6.209139 17,4 C17,1.790861 15.209139,0 13,0 Z" transform="translate(2 4)"></path><path d="M0,0 L24,0 L24,24 L0,24 L0,0 Z M0,0 L24,0 L24,24 L0,24 L0,0 Z M0,0 L24,0 L24,24 L0,24 L0,0 Z"></path></g></svg>
                        <div  className="column"><span><FormattedMessage id="Friends"/></span></div>
                    </NavLink>

                    <div className="Messages-Friends column">
                        <div className="MessagesContainer column">
                            <div className="MessagesHeader row">
                                <span><FormattedMessage id="PersonalMessages"/></span>
                                <div  data-tooltip="Создать ЛС" onClick={(e) => this.OnClickCreatedRoom(e)} className="tooltipGlobal AddedInMessages column">
                                    <svg x="0" y="0" className="PrivateChannelCreated" aria-hidden="false" width="18" height="18" viewBox="0 0 18 18"><polygon fillRule="nonzero" fill="var(--default-color-messange-hover)" points="15 10 10 10 10 15 8 15 8 10 3 10 3 8 8 8 8 3 10 3 10 8 15 8"></polygon></svg>
                                </div>
                            </div>
                            <div className="column messageContainer">
                                {this.props.UserData?.Channels?.map((channelID,index) => {
                                   return <ChatRow 
                                   channel_users={this.props.Storage.channels[channelID].users} 
                                   to={'/channel/' + channelID} 
                                   key={'chat_' + channelID } 
                                   isSelected={params.ChannelID === channelID.toString()}
                                   />
                                })}
                            </div>
                        </div>

                    </div>
                    <div className="row userBottomElement">
                        <div className="row" >
                            <img src={this.GetUserDataByID(this.props.UserData?.id)?.Url} alt="2"/>
                            <div className="column userInfo">
                                <div className="column">
                                    <span>{this.GetUserDataByID(this.props.UserData?.id)?.username}</span>
                                    {/* <span>В сети</span> */}
                                </div>
                            </div>
                        </div>
                        <div className="row buttonsRight">
                            <button onClick={e => this.UpdateProfileShow(true)} data-tooltip="Настройки Пользователя" className="tooltipGlobal ButtonProfile" >
                                <svg id="settingsSVG" aria-hidden="false" width="20" height="20" viewBox="0 0 24 24"><path fill="var(--default-color-messange)"  d="M19.738 10H22V14H19.739C19.498 14.931 19.1 15.798 18.565 16.564L20 18L18 20L16.565 18.564C15.797 19.099 14.932 19.498 14 19.738V22H10V19.738C9.069 19.498 8.203 19.099 7.436 18.564L6 20L4 18L5.436 16.564C4.901 15.799 4.502 14.932 4.262 14H2V10H4.262C4.502 9.068 4.9 8.202 5.436 7.436L4 6L6 4L7.436 5.436C8.202 4.9 9.068 4.502 10 4.262V2H14V4.261C14.932 4.502 15.797 4.9 16.565 5.435L18 3.999L20 5.999L18.564 7.436C19.099 8.202 19.498 9.069 19.738 10ZM12 16C14.2091 16 16 14.2091 16 12C16 9.79086 14.2091 8 12 8C9.79086 8 8 9.79086 8 12C8 14.2091 9.79086 16 12 16Z"></path></svg>
                            </button>
                        </div>
                    </div>
                </div>
                <div className="column MessageContainer">
                    <div className="headerMainText headerBlock row">
                        <div className="row userInfoHeader">
                            <div  data-hidden={!params.ChannelID} className={"OnlineStatusMessages IsOnline"} />
                            <span data-hidden={!params.ChannelID}> <FormattedMessage id='Channel_number' values={{id : params.ChannelID}} /> </span> 
                        </div>

                        <div className="toolbar row">
                            <button data-tooltip="Добавить в друзья" className="addFriendInChat row tooltipGlobal bottomTooltip">
                                <div><svg x="0" y="0" className="icon" aria-hidden="false" width="24" height="24" viewBox="0 0 24 24"><path className="pathColor" fill="var(--default-color-messange)" fillRule="evenodd" clipRule="evenodd" d="M21 3H24V5H21V8H19V5H16V3H19V0H21V3ZM10 12C12.205 12 14 10.205 14 8C14 5.795 12.205 4 10 4C7.795 4 6 5.795 6 8C6 10.205 7.795 12 10 12ZM10 13C5.289 13 2 15.467 2 19V20H18V19C18 15.467 14.711 13 10 13Z"></path></svg></div>
                            </button>
                            <div className="column SearchInput-Rows">
                                <div className="SearchContainer row">
                                    <input onChange={e => this.OnChangeSearchText(e.target.value)} value={this.state.searchText} placeholder="Поиск"/>
                                    <div className="clearSearch" role="button">
                                        <div className="iconContainer">
                                            <svg aria-hidden="false" width="24" height="24" viewBox="0 0 24 24"><path className="pathColor" fill="var(--default-color-messange)" d="M21.707 20.293L16.314 14.9C17.403 13.504 18 11.799 18 10C18 7.863 17.167 5.854 15.656 4.344C14.146 2.832 12.137 2 10 2C7.863 2 5.854 2.832 4.344 4.344C2.833 5.854 2 7.863 2 10C2 12.137 2.833 14.146 4.344 15.656C5.854 17.168 7.863 18 10 18C11.799 18 13.504 17.404 14.9 16.314L20.293 21.706L21.707 20.293ZM10 16C8.397 16 6.891 15.376 5.758 14.243C4.624 13.11 4 11.603 4 10C4 8.398 4.624 6.891 5.758 5.758C6.891 4.624 8.397 4 10 4C11.603 4 13.109 4.624 14.242 5.758C15.376 6.891 16 8.398 16 10C16 11.603 15.376 13.11 14.242 14.243C13.109 15.376 11.603 16 10 16Z"></path></svg>
                                            <svg className="hidden" width="24" height="24" viewBox="0 0 24 24"><path fill="var(--default-color-messange)" d="M18.4 4L12 10.4L5.6 4L4 5.6L10.4 12L4 18.4L5.6 20L12 13.6L18.4 20L20 18.4L13.6 12L20 5.6L18.4 4Z"></path></svg>
                                        </div>
                                    </div>
                                </div>

                                <div className="SearchContainerUsers column">
                                    {this.state.UsersSearch.map(value => {
                                        return this.UserSearchComponent(value.username,value.Url,value.id)
                                    })}
                                </div>
                            </div>
                        </div>
                    </div> 
 
                    {params.ChannelID && this.MessagesContainer(params,messages)}
                    {!params.ChannelID && this.FriendsListContainer()}
                 
                </div>
            </div>
            </React.StrictMode>
        );  
    }
}

const mapStateToProps = (state : RootState) => {
    return { 
        IsLoading:state.APPReducer.AppLoading,
        socket : state.APPReducer.Socket,
        UserData : state.APPReducer.user, 
        Storage : state.StorageReducer,
        friends : state.APPReducer.user.friendsList || []
    };
}



const connector = connect(mapStateToProps,{
        AppUpdateLoadingAction,
        AppUserDataAction, 
        MessageSelectAction,  
        InitStorageAction, 
        InitStorageMessagesAction,
        StorageMessageAdded,
        AppUserFriendListUpdateAction,
})
type PropsFromRedux = ConnectedProps<typeof connector> & RouteComponentProps

export default connector(MessagesRouter)

// export default MessagesRouter;
