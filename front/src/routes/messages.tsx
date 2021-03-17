import React, { ChangeEvent } from 'react';
import MessageRow from '../components/MessageRow';
import UserRow from '../components/userRow';
import '../styles/MessagesRouter.css';
import TextareaAutosize, { TextareaAutosizeProps } from 'react-textarea-autosize';
import Preloader from '../components/Preloader';
import { connect, ConnectedProps } from 'react-redux';
import { RootState } from '../redux/rootReducer';
import { AppUpdateLoadingAction, AppUserDataAction, InitStorageAction, InitStorageMessagesAction, MessageSelectAction } from '../redux/actions';
import { NavLink, RouteComponentProps } from 'react-router-dom';
import { MessageInterface, MessageSendInterface, ResponseMessageData, ResponseUserData } from '../../../global/types';
import ChatRow from '../components/chatRow';
import Participants from '../components/participants';


interface MessageRouterParams{
    ChannelID? : string
}
 
class MessagesRouter extends React.Component<PropsFromRedux, { transitionHidden : boolean, inputValue : string}>{

    messageInput : string = ''
    uploadMessageForChannel : boolean = false;

    ref : HTMLDivElement | null | undefined

    constructor(props : PropsFromRedux){
        super(props);
        this.state = {
            transitionHidden : false,
            inputValue : '',
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

            this.props.AppUserDataAction({
                id : res.data[0].id,
                Channels : res.data[0].Channels,
            })
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
        })


    }

    GetUserDataByID(id : number){
        return this.props.Storage.users.find((value) => value.id === id)
    }

    UploadMessagesForChannel(channelID : string){
        this.uploadMessageForChannel = true
        fetch('http://localhost:8080/api/messages/' + channelID,{
            credentials : 'include',
        }).then(res => res.json()).then((res : ResponseMessageData) => {
            console.log(res)
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
        this.ref!.scrollTop = this.ref!.scrollHeight
    }

    OnSendMessage(){
        const channelID = (this.props.match.params as MessageRouterParams).ChannelID
        if (!channelID) return;
        this.props.socket.emit('message_send',{
            text : this.state.inputValue,
            ChannelID : Number(channelID),
        } as MessageSendInterface)

        this.setState({
            inputValue : ''
        })
        
    }

    GenerateHeader(messages : MessageInterface[]){
        const msgs = [...messages]
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
        this.ref!.scrollTop = this.ref!.scrollHeight
        return true;
    }

    render(){

        const params = (this.props.match.params as MessageRouterParams)
        const messages = params.ChannelID && this.GetMessagesForChannel(params.ChannelID)

        return (
            <React.StrictMode>
            {this.props.IsLoading ? <Preloader transitionHidden={this.state.transitionHidden}/> : ''}
            <div className="MessagesBlock row">
                <div className="column leftElement">
                    <div className="headerBlock searchContainer row" >
                        <input placeholder="Найти Беседу"/>
                    </div>

                    <div className="row friendsLink">
                        <svg className="linkButtonIcon" aria-hidden="false" width="24" height="24" viewBox="0 0 24 24"><g fill="none" fillRule="evenodd"><path id="main" fill="var(--default-color-messange)" fillRule="nonzero" d="M0.5,0 L0.5,1.5 C0.5,5.65 2.71,9.28 6,11.3 L6,16 L21,16 L21,14 C21,11.34 15.67,10 13,10 C13,10 12.83,10 12.75,10 C8,10 4,6 4,1.5 L4,0 L0.5,0 Z M13,0 C10.790861,0 9,1.790861 9,4 C9,6.209139 10.790861,8 13,8 C15.209139,8 17,6.209139 17,4 C17,1.790861 15.209139,0 13,0 Z" transform="translate(2 4)"></path><path d="M0,0 L24,0 L24,24 L0,24 L0,0 Z M0,0 L24,0 L24,24 L0,24 L0,0 Z M0,0 L24,0 L24,24 L0,24 L0,0 Z"></path></g></svg>
                        <NavLink to='/channel' className="column"><span>Друзья</span></NavLink>
                    </div>

                    <div className="Messages-Friends column">
                        <div className="MessagesContainer column">
                            <div className="MessagesHeader row">
                                <span>Личные Сообщения</span>
                                <div  data-tooltip="Создать ЛС" className="tooltipGlobal AddedInMessages column">
                                    <svg x="0" y="0" className="PrivateChannelCreated" aria-hidden="false" width="18" height="18" viewBox="0 0 18 18"><polygon fillRule="nonzero" fill="var(--default-color-messange-hover)" points="15 10 10 10 10 15 8 15 8 10 3 10 3 8 8 8 8 3 10 3 10 8 15 8"></polygon></svg>
                                </div>
                            </div>
                            <div className="column messageContainer">
                                {this.props.UserData?.Channels?.map((channelID,index) => {
                                   return <ChatRow channel_users={this.props.Storage.channels[channelID].users} to={'/channel/' + channelID} key={'chat_' + channelID } />
                                })}
                            </div>
                        </div>

                    </div>
                    <div className="row userBottomElement">
                        <div className="row" >
                            <img src="https://cdn.discordapp.com/avatars/603355055025815563/bd1b03dcbcf8c168b828cf59a329d62f.png?size=128" alt="2"/>
                            <div className="column userInfo">
                                <div className="column">
                                    <span>{this.GetUserDataByID(this.props.UserData?.id)?.username}</span>
                                    <span>В сети</span>
                                </div>
                            </div>
                        </div>
                        <div className="row buttonsRight">
                            <button data-tooltip="Настройки Пользователя" className="tooltipGlobal ButtonProfile" >
                                <svg id="settingsSVG" aria-hidden="false" width="20" height="20" viewBox="0 0 24 24"><path fill="var(--default-color-messange)"  d="M19.738 10H22V14H19.739C19.498 14.931 19.1 15.798 18.565 16.564L20 18L18 20L16.565 18.564C15.797 19.099 14.932 19.498 14 19.738V22H10V19.738C9.069 19.498 8.203 19.099 7.436 18.564L6 20L4 18L5.436 16.564C4.901 15.799 4.502 14.932 4.262 14H2V10H4.262C4.502 9.068 4.9 8.202 5.436 7.436L4 6L6 4L7.436 5.436C8.202 4.9 9.068 4.502 10 4.262V2H14V4.261C14.932 4.502 15.797 4.9 16.565 5.435L18 3.999L20 5.999L18.564 7.436C19.099 8.202 19.498 9.069 19.738 10ZM12 16C14.2091 16 16 14.2091 16 12C16 9.79086 14.2091 8 12 8C9.79086 8 8 9.79086 8 12C8 14.2091 9.79086 16 12 16Z"></path></svg>
                            </button>
                        </div>
                    </div>
                </div>
                <div className="column MessageContainer">
                    <div className="headerMainText headerBlock row">
                        <div className="row userInfoHeader">
                            <span>{ params.ChannelID && messages ?  this.GenerateHeader(messages) : ''}</span> 
                            <div className={(!params.ChannelID ? 'hidden ' : '') + "OnlineStatusMessages IsOnline"} />
                        </div>

                        <div className="toolbar row">
                            <button data-tooltip="Добавить в друзья" className="addFriendInChat row tooltipGlobal bottomTooltip">
                                <div><svg x="0" y="0" className="icon" aria-hidden="false" width="24" height="24" viewBox="0 0 24 24"><path className="pathColor" fill="var(--default-color-messange)" fillRule="evenodd" clipRule="evenodd" d="M21 3H24V5H21V8H19V5H16V3H19V0H21V3ZM10 12C12.205 12 14 10.205 14 8C14 5.795 12.205 4 10 4C7.795 4 6 5.795 6 8C6 10.205 7.795 12 10 12ZM10 13C5.289 13 2 15.467 2 19V20H18V19C18 15.467 14.711 13 10 13Z"></path></svg></div>
                            </button>
                            <div className="SearchContainer row">
                                <input placeholder="Поиск"/>
                                <div className="clearSearch" role="button">
                                    <div className="iconContainer">
                                        <svg aria-hidden="false" width="24" height="24" viewBox="0 0 24 24"><path className="pathColor" fill="var(--default-color-messange)" d="M21.707 20.293L16.314 14.9C17.403 13.504 18 11.799 18 10C18 7.863 17.167 5.854 15.656 4.344C14.146 2.832 12.137 2 10 2C7.863 2 5.854 2.832 4.344 4.344C2.833 5.854 2 7.863 2 10C2 12.137 2.833 14.146 4.344 15.656C5.854 17.168 7.863 18 10 18C11.799 18 13.504 17.404 14.9 16.314L20.293 21.706L21.707 20.293ZM10 16C8.397 16 6.891 15.376 5.758 14.243C4.624 13.11 4 11.603 4 10C4 8.398 4.624 6.891 5.758 5.758C6.891 4.624 8.397 4 10 4C11.603 4 13.109 4.624 14.242 5.758C15.376 6.891 16 8.398 16 10C16 11.603 15.376 13.11 14.242 14.243C13.109 15.376 11.603 16 10 16Z"></path></svg>
                                        <svg className="hidden" width="24" height="24" viewBox="0 0 24 24"><path fill="var(--default-color-messange)" d="M18.4 4L12 10.4L5.6 4L4 5.6L10.4 12L4 18.4L5.6 20L12 13.6L18.4 20L20 18.4L13.6 12L20 5.6L18.4 4Z"></path></svg>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div> 

                    <div className="row mainContent">
                        <div  className="messagesContainerMain column">
                            <div ref={(e) => {this.ref = e}} className="MessagesBlocksMain">
                                <div className="column">
                                    <div className="column">
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
                            <div className="InputMessage row">
                                <div className="InputMessageBlock row">
                                    <button className="InputFile" ><svg width="24" height="24" viewBox="0 0 24 24"><path  fill="rgb(190, 190, 190)" d="M12 2.00098C6.486 2.00098 2 6.48698 2 12.001C2 17.515 6.486 22.001 12 22.001C17.514 22.001 22 17.515 22 12.001C22 6.48698 17.514 2.00098 12 2.00098ZM17 13.001H13V17.001H11V13.001H7V11.001H11V7.00098H13V11.001H17V13.001Z"></path></svg></button>
                                    <TextareaAutosize value={this.state.inputValue} onChange={(e) => this.onChangeMessage(e)} onKeyDown={(e) => this.onKeyPressed(e)} tabIndex={0} spellCheck={true} placeholder="Message" maxLength={2000} className="InputText" wrap="soft"/>
                                    <div className="emoji_smile_icon_vector"></div>
                                </div>
                            </div>
                        </div>

                        {params.ChannelID && this.props.Storage.channels[params.ChannelID] 
                        && <Participants channels={this.props.Storage.channels[params.ChannelID].users } />}
                    </div>
                 
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
        Storage : state.StorageReducer
    };
}

const connector = connect(mapStateToProps,{
        AppUpdateLoadingAction,
        AppUserDataAction, 
        MessageSelectAction,  
        InitStorageAction, 
        InitStorageMessagesAction,
})
type PropsFromRedux = ConnectedProps<typeof connector> & RouteComponentProps

export default connector(MessagesRouter)

// export default MessagesRouter;
