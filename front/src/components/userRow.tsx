import React from 'react';
import '../styles/userRow.css';
class UserRow extends React.Component{
    render(){
        return (
            <div className="row userRow" >
                <div className="ImageContainer">
                    <img src="https://cdn.discordapp.com/avatars/603355055025815563/bd1b03dcbcf8c168b828cf59a329d62f.png?size=128" alt="2"/>
                    <div className="OnlineStatusContainer">
                        <div className="OnlineStatus IsOnline" />
                    </div>
                </div>
                <div className="column userName_status">
                    <span>HappyFeedFriends</span>
                </div>
            </div>
        );  
    }
}

export default UserRow;