import React from 'react';
import { NavLink } from 'react-router-dom';
import UserRow from './userRow';

interface ChatRowProps {
    to : string,
    
}

class ChatRow extends React.Component<ChatRowProps>{
    render(){
        return (
            <NavLink to={this.props.to}>
                <UserRow />
            </NavLink>
        );  
    }
}

export default ChatRow;