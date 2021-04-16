import React from 'react';
import { connect, ConnectedProps } from 'react-redux';
import { AppUserChannelsAction, StoragePushUserAction, StorageUserUpdate } from '../../redux/actions';
import { RootState } from '../../redux/rootReducer';
import '../../styles/modal_window_created_channel.scss';
import UserRow from '../userRow';

interface ModalWindowCreatedChannelStates {
    users : Array<UserLocalData>
}

interface ModalWindowCreatedChannelProps {
    channel_id : string,
}

class ModalWindowFriendsInvite extends React.Component<PropsFromRedux,ModalWindowCreatedChannelStates>{

    constructor(props : PropsFromRedux){
        super(props);

        this.state = {
            users : [],
        }
    }

    componentDidMount(){

        fetch('http://localhost:8080/api/friends/friendlist?isfull=1',{
            credentials : 'include',
        }).then(res => res.json()).then(res => {
            this.setState({
                users : res.data
            })
        }) 

    }

    AddedFriendInChat(user_id : number){
        fetch('http://localhost:8080/api/friends/addFriendInChat',{
            credentials : 'include',
            method : 'POST',
            headers : {
                'Content-Type' : 'application/json',
            },
            body: JSON.stringify({
                user_id : user_id,
                channel_id : Number(this.props.channel_id)
            } as BodyAddFriendData),
        }).then(res => res.json()).then((res : ResponseGeneric<UserLocalData>) => {
            this.props.StorageUserUpdate(res.data[0])
            this.props.StoragePushUserAction({
                user_id : user_id,
                channel_id : Number(this.props.channel_id),
            })
        }) 
    }

    render(){
        return (
            <div className={"modal_window_created_channel column"}>
                <div className="column containerModal">
                    {this.state.users.map(userData => {
                        return (
                        <div key={'user_row' + userData.id} onClick={e => this.AddedFriendInChat(userData.id)} > 
                            <UserRow id={userData.id} userData={userData} /> 
                        </div>)
                    })}
                </div>
            </div>
        );  
    }
}

const mapStateToProps = (state : RootState) => {
    return {};
}

const connector = connect(mapStateToProps,{
    StorageUserUpdate,
    StoragePushUserAction,
})
type PropsFromRedux = ConnectedProps<typeof connector> & ModalWindowCreatedChannelProps

export default connector(ModalWindowFriendsInvite)

