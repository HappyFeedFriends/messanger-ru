import React from 'react';
import '../styles/Logo.css';
class Logo extends React.Component{
    render(){
        return (
            <div className="logoContainer">
                <div className="logo"/>
                <div className="logo two"/>
            </div>
        );  
    }
}

export default Logo;