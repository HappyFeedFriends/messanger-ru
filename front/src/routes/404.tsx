import React from 'react';
import '../styles/404.css';

import aaaa from '../images/aaaaa.gif'
import facepalm from '../images/facepalm.gif'
import omg from '../images/omg.gif'
import { NavLink } from 'react-router-dom';

class Error_404 extends React.Component{
    render(){

        const img = [aaaa,facepalm,omg].sort((a,b) => Math.random() - 0.5 )[0]

        return (
            <div className="column" style={{backgroundColor:'#262D34',width:'100vw',height:'100vh'}}>
                <div className="row mainContainer">

                    <img src={img} />
                    <div className="column textContent">
                        <h1>404</h1>
                        <span>Похоже мы не нашли страницу в наших архивах</span>
                        <NavLink to='/' className="row" >
                            <span>Хочу обратно</span>
                        </NavLink>
                    </div>

                </div>
            </div>
        );  
    }
}
 
export default Error_404;
