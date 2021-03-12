import React from 'react';
import '../styles/MessageRow.css';

interface MessageRowProps{
    IsDuplicate : boolean
}

class MessageRow extends React.Component<MessageRowProps>{


    DuplicateAuthorMessage(){
        return (
            <div className="MessageRow row isDuplicate">
                <div className="MessageContent column">
                    <span className="messageContent">Моё первое сообщение!</span>
                </div>
            </div> 
        );
    }

    render(){

        const { IsDuplicate } = this.props

        if (IsDuplicate){
            return this.DuplicateAuthorMessage()
        }

        return (
            <div className="MessageRow row">
                <img src="https://cdn.discordapp.com/avatars/603355055025815563/bd1b03dcbcf8c168b828cf59a329d62f.png?size=128" alt="2"/>
                <div className="MessageContent column">
                    <h2>HappyFeedFriends</h2>
                    <span className="messageContent">Моё первое сообщение!</span>
                </div>
            </div> 
        );  
    }
}

export default MessageRow;