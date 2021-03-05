import React from 'react';
import { Link, NavLink } from 'react-router-dom';
import Preloader from '../components/Preloader';
import UserRow from '../components/userRow';
import '../styles/MessagesRouter.css';

class MessagesRouter extends React.Component{
    render(){
        return (
            <div className="MessagesBlock column">
                <div className="column leftElement">
                    <div className="headerBlock searchContainer row" >
                        <button type="button">Найти беседу</button>
                    </div>
                    <div className="Messages-Friends column">

                        <div className="row friendsLink">
                            <svg className="linkButtonIcon" aria-hidden="false" width="24" height="24" viewBox="0 0 24 24"><g fill="none" fillRule="evenodd"><path id="main" fill="var(--default-color-messange)" fillRule="nonzero" d="M0.5,0 L0.5,1.5 C0.5,5.65 2.71,9.28 6,11.3 L6,16 L21,16 L21,14 C21,11.34 15.67,10 13,10 C13,10 12.83,10 12.75,10 C8,10 4,6 4,1.5 L4,0 L0.5,0 Z M13,0 C10.790861,0 9,1.790861 9,4 C9,6.209139 10.790861,8 13,8 C15.209139,8 17,6.209139 17,4 C17,1.790861 15.209139,0 13,0 Z" transform="translate(2 4)"></path><path d="M0,0 L24,0 L24,24 L0,24 L0,0 Z M0,0 L24,0 L24,24 L0,24 L0,0 Z M0,0 L24,0 L24,24 L0,24 L0,0 Z"></path></g></svg>
                            <div className="column"><span>Друзья</span></div>
                        </div>

                        <div className="MessagesContainer column">
                            <div className="MessagesHeader row">
                                <span>Личные Сообщения</span>
                                <div className="AddedInMessages column">
                                    <svg x="0" y="0" className="PrivateChannelCreated" aria-hidden="false" width="18" height="18" viewBox="0 0 18 18"><polygon fillRule="nonzero" fill="var(--default-color-messange-hover)" points="15 10 10 10 10 15 8 15 8 10 3 10 3 8 8 8 8 3 10 3 10 8 15 8"></polygon></svg>
                                    <div className="tooltip">
                                        <span>Создать ЛС</span>
                                    </div>
                                </div>
                            </div>
                            <div className="column messageContainer">
                                <UserRow />
                                <UserRow />
                                <UserRow />
                                <UserRow />
                                <UserRow />
                                <UserRow />
                                <UserRow />
                                <UserRow />
                                <UserRow />
                                <UserRow />
                                <UserRow />
                                <UserRow />
                                <UserRow />
                                <UserRow />
                                <UserRow />
                                <UserRow />
                                <UserRow />
                                <UserRow />
                                <UserRow />
                                <UserRow />
                                <UserRow />
                                <UserRow />
                            </div>
                        </div>

                    </div>
                    <div className="row userBottomElement">
                        <img src="https://cdn.discordapp.com/avatars/603355055025815563/bd1b03dcbcf8c168b828cf59a329d62f.png?size=128" alt="2"/>
                        <div className="column">
                            <div className="column userName_status">
                                <span>HappyFeedFriends</span>
                                <span>Статус</span>
                            </div>
                        </div>
                        <div className="row buttonsRight">
                            <button className="ButtonProfile" >
                                <svg id="settingsSVG" aria-hidden="false" width="20" height="20" viewBox="0 0 24 24"><path fill="var(--default-color-messange)"  d="M19.738 10H22V14H19.739C19.498 14.931 19.1 15.798 18.565 16.564L20 18L18 20L16.565 18.564C15.797 19.099 14.932 19.498 14 19.738V22H10V19.738C9.069 19.498 8.203 19.099 7.436 18.564L6 20L4 18L5.436 16.564C4.901 15.799 4.502 14.932 4.262 14H2V10H4.262C4.502 9.068 4.9 8.202 5.436 7.436L4 6L6 4L7.436 5.436C8.202 4.9 9.068 4.502 10 4.262V2H14V4.261C14.932 4.502 15.797 4.9 16.565 5.435L18 3.999L20 5.999L18.564 7.436C19.099 8.202 19.498 9.069 19.738 10ZM12 16C14.2091 16 16 14.2091 16 12C16 9.79086 14.2091 8 12 8C9.79086 8 8 9.79086 8 12C8 14.2091 9.79086 16 12 16Z"></path></svg>
                                <div className="tooltip">
                                    <span>Настройки Пользователя</span>
                                </div>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );  
    }
}
 
export default MessagesRouter;
