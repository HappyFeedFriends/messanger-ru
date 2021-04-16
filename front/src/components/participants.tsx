import React from 'react';
import '../styles/Logo.scss';
import UserRow from '../components/userRow';
import { ModalWindowEnum } from '../enums';
interface ParticipantsProps {
    channels : number[],
    openModal : (formID : ModalWindowEnum) => void;
}

class Participants extends React.Component<ParticipantsProps>{

    render(){
        return (
            <div className={"participants_block column"}>
                <div className="ParticianitsHeader row">
                    <span>Участники — {this.props.channels.length}</span>
                </div>
                {this.props.channels.map(user_id => {
                    return <UserRow id={user_id} key={'chat_' + user_id } />
                })}
                <div onClick={e => this.props.openModal(ModalWindowEnum.MODAL_WINDOW_FRIEND_INVITE_CHAT)} className="AddedFriendInChatContainer row">
                    <span>Добавить участника</span>
                </div> 
        </div>
        );  
    }
}

export default Participants;