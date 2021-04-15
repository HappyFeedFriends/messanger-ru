import React from 'react';
import { connect, ConnectedProps } from 'react-redux';
import { NavLink } from 'react-router-dom';
import { RootState } from '../redux/rootReducer';
import UserRow from './userRow';

interface ChatRowProps {
    to : string,
    isSelected : boolean,
    channel_users : number[],
    
}

class ChatRow extends React.Component<PropsFromRedux>{

    GetUserDataByID(id : number){
        return this.props.Storage.users.find((value) => value.id === id)
    }

    GetAvatarID(){
        return this.props.channel_users.filter((user_id) => this.GetUserDataByID(user_id)?.id !== this.props.UserData.id)[0] || this.props.UserData.id
    }
    
    render(){
        return (
            <NavLink className="ChatRow" data-selected-state={this.props.isSelected} to={this.props.to}>
                <UserRow id={this.GetAvatarID()} />
            </NavLink>
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

type PropsFromRedux = ConnectedProps<typeof connector> & ChatRowProps

export default connector(ChatRow)
