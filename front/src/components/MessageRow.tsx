import React from 'react';
import { connect, ConnectedProps } from 'react-redux';
import { RootState } from '../redux/rootReducer';
import '../styles/MessageRow.scss';
import documentIcon from '../images/document.png'
import moment from 'moment';
import 'moment/locale/ru'
import 'moment/locale/en-au'

interface MessageRowProps{
    IsDuplicate : boolean,
    messageData : MessageInterface
    IsPseudoMessage? : boolean
}

interface MessageRowState {
    user : UserLocalData,
    isDocument : boolean,
    url? : string
    filename : string,
}

class MessageRow extends React.Component<PropsFromRedux,MessageRowState>{

 
    DuplicateAuthorMessage(){
        return (
            <div data-pseudo={this.props.IsPseudoMessage === true} className="MessageRow row isDuplicate">
                <div className="MessageContent column">
                    <span className="messageContent mainText">{this.props.messageData.content}</span>
                    {this.GetFileContainer()}
                </div>
            </div> 
        );
    }

    constructor(props : PropsFromRedux){
        super(props)
        const isDocument = (() => {
            if (!props.messageData.Url) return true
            const execes = [
                'gif',
                'jpeg',
                'jpg',
                'png',
                'webm',
                'svg'
            ];

            return !execes.includes(props.messageData.Url.split('.').pop() || '')
        })() && !!props.messageData.Url
        
        const filename = (() => {
            if (!props.messageData.Url) return ''

            return (props.messageData.Url.split('/').pop() || '')

        })()

        this.state ={
            user : this.GetUserDataByID(props.messageData.AuthorID) || { username : "WOW! Error!", Url : '',id : -1,onlinestatus : false },
            isDocument : isDocument,
            url : isDocument ? documentIcon : props.messageData.Url, 
            filename : filename,
        }
    }

    GetUserDataByID(id : number){
        return this.props.Storage.users.find((value) => value.id === id)
    }

    GetFileContainer(){

        if (!this.state.url){
            return;
        }

        return (
        <div data-isdocument={this.state.isDocument} className="row fileContainerMessage">
            <div style={{position : 'relative',left:0,right:0, bottom:0,top:0}}>
                <div className="HoverUp"/> 
                <img className="MessageContentImage" src={ this.state.url} alt=""/>
            </div>
            <span className="MessageContentFileName">{this.state.filename}</span>
            <a href={document.location.protocol + '//' + this.props.messageData.Url}>
                <svg className="DownloadButton" aria-hidden="false" width="32" height="32" viewBox="0 0 32 32"><path fill="#b9bbbe" fillRule="evenodd" clipRule="evenodd" d="M16.293 9.293L17.707 10.707L12 16.414L6.29297 10.707L7.70697 9.293L11 12.586V2H13V12.586L16.293 9.293ZM18 20V18H20V20C20 21.102 19.104 22 18 22H6C4.896 22 4 21.102 4 20V18H6V20H18Z"></path></svg>
            </a>
        </div>
        )
    }

    TransfromDate(){
        return moment(this.props.messageData.created_at).locale(this.props.lang).calendar();
    }

    MessageRowCompact(){

        const time = moment(this.props.messageData.created_at).locale(this.props.lang).format('LT');

        return (
            <div data-compact-mode='true' data-pseudo={this.props.IsPseudoMessage === true} className="MessageRow row">
                <div className="row mainInfo">
                    <div className="MessageContent column">
                        <div className="row">
                            <span className="dateFormat">{time}</span>
                            <h2>{this.state.user.username}</h2>
                            <span className="messageContent mainText">{this.props.messageData.content}</span>
                        </div>
                        {this.GetFileContainer()}
                    </div>
                </div>
            </div> 
        )
    }

    render(){

        if (this.props.MessageFormat === 'compact'){
            return this.MessageRowCompact()
        }

        if (this.props.IsDuplicate){
            return this.DuplicateAuthorMessage()
        }
        const time = this.TransfromDate()

        return (
            <div data-pseudo={this.props.IsPseudoMessage === true} className="MessageRow row">
                <div className="row mainInfo">
                    <img src={this.state.user.Url} alt="2"/>
                    <div className="MessageContent column">
                        <div className="row">
                            <h2>{this.state.user.username}</h2>
                            <span className="dateFormat">{time}</span>
                        </div>
                        <span className="messageContent mainText">{this.props.messageData.content}</span>
                        {this.GetFileContainer()}
                    </div>
                </div>
            </div> 
        );  
    }
}

const mapStateToProps = (state : RootState) => {
    return { 
        UserData : state.APPReducer.user, 
        Storage : state.StorageReducer,
        MessageFormat : state.APPReducer.messageFormat,
        lang : state.APPReducer.lang
    };
}

const connector = connect(mapStateToProps,{})
type PropsFromRedux = ConnectedProps<typeof connector> & MessageRowProps

export default connector(MessageRow)