import React from 'react';
import { Redirect } from 'react-router';
import { Link } from 'react-router-dom';
import '../styles/404.css';

class signIn extends React.Component{
    render(){
        return (
            <a href="http://localhost:8080/auth/user_data" >Авторизоваться</a>
        );  
    }
}
 
export default signIn;
