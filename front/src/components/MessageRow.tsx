import React from 'react';
import { connect, ConnectedProps } from 'react-redux';
import { MessageInterface, UserLocalData } from '../../../global/types';
import { RootState } from '../redux/rootReducer';
import '../styles/MessageRow.css';

interface MessageRowProps{
    IsDuplicate : boolean,
    messageData : MessageInterface
}

interface MessageRowState {
    user : UserLocalData,
}

class MessageRow extends React.Component<PropsFromRedux,MessageRowState>{


    DuplicateAuthorMessage(){
        return (
            <div className="MessageRow row isDuplicate">
                <div className="MessageContent column">
                    <span className="messageContent">{this.props.messageData.content}</span>
                </div>
            </div> 
        );
    }

    constructor(props : PropsFromRedux){
        super(props)
        this.state ={
            user : this.GetUserDataByID(props.messageData.AuthorID) || { username : "WOW! Error!", Url : '',id : -1 }
        }
    }

    GetUserDataByID(id : number){
        return this.props.Storage.users.find((value) => value.id === id)
    }

    render(){

        const { IsDuplicate } = this.props

        if (IsDuplicate){
            return this.DuplicateAuthorMessage()
        }

        return (
            <div className="MessageRow row">
                <img src={this.state.user.Url} alt="2"/>
                <div className="MessageContent column">
                    <h2>{this.state.user.username}</h2>
                    <span className="messageContent">{this.props.messageData.content}</span>
                </div>
            </div> 
        );  
    }
}

const mapStateToProps = (state : RootState) => {
    return { 
        UserData : state.APPReducer.user, 
        Storage : state.StorageReducer
    };
}

const connector = connect(mapStateToProps,{})
type PropsFromRedux = ConnectedProps<typeof connector> & MessageRowProps

export default connector(MessageRow)