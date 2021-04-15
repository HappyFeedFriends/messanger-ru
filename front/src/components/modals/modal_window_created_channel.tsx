import React from 'react';
import { connect, ConnectedProps } from 'react-redux';
import { AppUserChannelsAction, StorageUserUpdate } from '../../redux/actions';
import { RootState } from '../../redux/rootReducer';

import '../../styles/modal_window_created_channel.scss';
import UserRow from '../userRow';

interface ModalWindowCreatedChannelStates{
    users : Array<UserLocalData>
}

// TODO: swap random users list on friend list
class ModalWindowCreatedChannel extends React.Component<PropsFromRedux,ModalWindowCreatedChannelStates>{

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

    OnSelectChat(userData : UserLocalData){
        fetch('http://localhost:8080/api/created_channel',{
            credentials : 'include',
            method : 'POST',
            headers : {
                'Content-Type' : 'application/json',
            },
            body : JSON.stringify({
                userID : userData.id
            })
        }).then(res => {
            if (res.status === 200){
                return res.json()
            }

            throw new Error(res.status.toString())
        })
        .then((res : ResponseCreatedChannel) => {
            this.props.StorageUserUpdate(res.data[0].user)
            this.props.AppUserChannelsAction(res.data[0])
        })
        .catch(err => {

        })
    }

    render(){
        return (
            <div className={"modal_window_created_channel column"}>
                <h1>С кем из них хочешь общаться?</h1>
                <div className="column containerModal">
                    {this.state.users.map(userData => {
                        return (
                        <div key={'user_row' + userData.id} onClick={e => this.OnSelectChat(userData)} > 
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
    AppUserChannelsAction,
    StorageUserUpdate
})

type PropsFromRedux = ConnectedProps<typeof connector>

export default connector(ModalWindowCreatedChannel)
