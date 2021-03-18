import React from 'react';
import { connect, ConnectedProps } from 'react-redux';
import { UserLocalData } from '../../../global/types';
import { RootState } from '../redux/rootReducer';
import '../styles/userRow.css';

interface UserRowProps {
    id : number,
    isOnline? : boolean,
}

interface UserRowStates{
    user : UserLocalData,
}

class UserRow extends React.Component<PropsFromRedux,UserRowStates>{

    constructor(props : PropsFromRedux){
        super(props)
        this.state = {
            user:  this.GetUserDataByID(this.props.id) || { username : 'wow! Error!', Url : '', id : -1, onlinestatus : false }
        }
    }

    GetUserDataByID(id : number){
        return this.props.Storage.users.find((value) => value.id === id)
    }

    render(){
        return (
            <div className="row userRow" >
                <div className="ImageContainer">
                    <img src={this.state.user.Url} alt="2"/>
                    <div className="OnlineStatusContainer">
                        <div data-online={this.state.user.onlinestatus} className="OnlineStatus" />
                    </div>
                </div>
                <div className="column userName_status">
                    <span>{this.state.user.username}</span>
                </div>
            </div>
        );  
    }
}

const mapStateToProps = (state : RootState) => {
    return { 
        Storage : state.StorageReducer
    };
}

const connector = connect(mapStateToProps)

type PropsFromRedux = ConnectedProps<typeof connector> & UserRowProps

export default connector(UserRow)
