import React from 'react';
import '../styles/Preloader.css';
class Preloader extends React.Component{
    render(){
        return (
            <div className="PreloadContainer column">
                <img src="./images/preloader.gif" alt="" className="Shark"/>
            </div>
        );  
    }
}

export default Preloader;