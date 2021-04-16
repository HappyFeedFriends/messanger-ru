import React from 'react';
import { connect, ConnectedProps } from 'react-redux';
import { RootState } from '../redux/rootReducer';
import '../styles/userRow.scss';

interface UserRowProps {
    id : number,
    isOnline? : boolean,
    userData? : UserLocalData
}


class UserRow extends React.Component<PropsFromRedux>{

    GetUser(){
        return this.props.userData || this.GetUserDataByID(this.props.id) || { username : 'wow! Error!', Url : '', id : -1, onlinestatus : false }
    }

    GetUserDataByID(id : number){
        return this.props.Storage.users.find((value) => value.id === id)
    }

    render(){
        const user = this.GetUser()
        return (
            <div className="row userRow" >
                <div className="ImageContainer">
                    <img src={user.Url} alt="2"/>
                    <div className="OnlineStatusContainer">
                        <div data-online={user.onlinestatus} className="OnlineStatus" />
                    </div>
                </div>
                <div className="column userName_status">
                    <span>{user.username}</span>
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
