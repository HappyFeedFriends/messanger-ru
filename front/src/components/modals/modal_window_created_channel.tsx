import React from 'react';
import { UserLocalData } from '../../../../global/types';

import '../../styles/modal_window_created_channel.css';
import UserRow from '../userRow';

interface ModalWindowCreatedChannelStates{
    users : Array<UserLocalData>
}

// TODO: swap random users list on friend list
class ModalWindowCreatedChannel extends React.Component<{},ModalWindowCreatedChannelStates>{

    constructor(props : {}){
        super(props);

        this.state = {
            users : [],
        }
    }

    componentDidMount(){

        fetch('http://localhost:8080/api/test/random_user_list',{
            credentials : 'include',
        }).then(res => res.json()).then(res => {
            this.setState({
                users : res.users
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
        .then(res => {

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
                        return (<div onClick={e => this.OnSelectChat(userData)} > 
                            <UserRow key={'user_row' + userData.id} id={userData.id} userData={userData} /> 
                        </div>)
                    })}
                </div>
            </div>
        );  
    }
}

export default ModalWindowCreatedChannel;