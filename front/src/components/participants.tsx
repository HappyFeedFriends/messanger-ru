import React from 'react';
import '../styles/Logo.css';
import UserRow from '../components/userRow';
interface ParticipantsProps {
    channels : number[],
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
        </div>
        );  
    }
}

export default Participants;