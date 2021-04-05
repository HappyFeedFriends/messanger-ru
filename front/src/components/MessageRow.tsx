import React from 'react';
import { connect, ConnectedProps } from 'react-redux';
import { MessageInterface, UserLocalData } from '../../../global/types';
import { RootState } from '../redux/rootReducer';
import '../styles/MessageRow.css';
import dateformat from 'dateformat';


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
                    <span className="messageContent mainText">{this.props.messageData.content}</span>
                </div>
            </div> 
        );
    }

    constructor(props : PropsFromRedux){
        super(props)
        this.state ={
            user : this.GetUserDataByID(props.messageData.AuthorID) || { username : "WOW! Error!", Url : '',id : -1,onlinestatus : false }
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
                <div className="row mainInfo">
                    <img src={this.state.user.Url} alt="2"/>
                    <div className="MessageContent column">
                        <div className="row">
                            <h2>{this.state.user.username}</h2>
                            <span className="dateFormat">{dateformat(this.props.messageData.created_at,'dd ddd in HH:MM mmmm yyyy')}</span>
                        </div>
                        <span className="messageContent mainText">{this.props.messageData.content}</span>
                        <div style={{position : 'relative'}}>
                            <div className="HoverUp"/>
                            <img  className="MessageContentImage" src="https://i.pinimg.com/736x/fb/61/71/fb6171eed67c51fa43b9c7a63090996f--flower-children-flower-girls.jpg" alt=""/>
                        </div>
                    </div>
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