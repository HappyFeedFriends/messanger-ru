import React from 'react';
import Logo from '../components/LogoMini';
import '../styles/MainPage.scss';
import {
    NavLink,
  } from "react-router-dom";

import image1 from '../images/1.gif'
import image2 from '../images/2.gif'
import image3 from '../images/3.gif'
import image4 from '../images/4.gif'
import image5 from '../images/5.gif'
import image6 from '../images/6.gif'
import image7 from '../images/7.gif'
import image8 from '../images/8.gif'
import image9 from '../images/9.gif'
import image10 from '../images/10.gif'

class MainPage extends React.Component{


    render(){
        return (
            <div className="MainPage column">
                <header className="row">
                    <a href="/" className="row headerLeftBlock">
                        <Logo />
                        <div className="header-MessangerLabel">
                            <span>Shark</span>
                        </div>
                    </a>
                    <div className="links">
                        <ul className="row">
                            <li><NavLink className="column" to="/" >Главная</NavLink></li>
                            <li className="HiddenPhone" ><NavLink className="column" to="/channel" >Начать общение</NavLink></li>
                            <li><NavLink className="column" to="/signin" >Регистрация</NavLink></li>  
                            <li><NavLink className="column" to="/signup" >Авторизация</NavLink></li>                           
                        </ul>
                    </div>
                </header>
                <div className="MainObject"> 
                    <div className="containerMainInfo row" >
                        <div className="ring big column" >
                            <span className="headerRing" >Shark</span>
                            <span className="MainTextRing" >Новый сервис обмена сообщениями и первый в России, с возможностью обмена сообщений между вселенными</span>
                        </div> 
                        <div className="ring small" /> 
                    </div>
                </div>
                <div className="column">
                    <div className="waves">
                        <svg height="100%" width="100%" id="bg-svg" viewBox="0 0 1440 700" xmlns="http://www.w3.org/2000/svg" className="transition duration-300 ease-in-out delay-150">
                            <path d="M 0,700 C 0,700 0,350 0,350 C 59.62820512820514,331.98717948717945 119.25641025641028,313.97435897435895 210,343 C 300.7435897435897,372.02564102564105 422.6025641025641,448.08974358974365 497,462 C 571.3974358974359,475.91025641025635 598.3333333333334,427.66666666666663 680,371 C 761.6666666666666,314.33333333333337 898.0641025641025,249.24358974358975 996,236 C 1093.9358974358975,222.75641025641025 1153.4102564102564,261.35897435897436 1221,289 C 1288.5897435897436,316.64102564102564 1364.2948717948718,333.3205128205128 1440,350 C 1440,350 1440,700 1440,700 Z"  fill="#262D34" className="transition-all duration-300 ease-in-out delay-150"></path>
                        </svg>
                    </div>
                    <div className="advantagesBlock column">
                        <span>Десять причин использовать Shark</span>
                        <div className="AdvantageMainContainer row" >

                            <div className="AdvantageContainer column">
                                <div className="imageAdvantage">
                                    <img src={image1} alt=""/>
                                </div>
                                <span className="cardHeader" >Удобство</span>
                                <span className="cardDescription"><span>Простой</span>, интуитивный интерфейс.</span>
                            </div>

                            <div className="AdvantageContainer column">
                                <div className="imageAdvantage">
                                    <img src={image2} alt=""/>
                                </div>
                                <span className="cardHeader" >Любовь</span>
                                <span className="cardDescription">Наша <span>команда</span> любит каждого своего пользователя, а также маленькие детали</span>
                            </div>

                            <div className="AdvantageContainer column">
                                <div className="imageAdvantage">
                                    <img src={image3} alt=""/>
                                </div>
                                <span className="cardHeader" >Подарки</span>
                                <span className="cardDescription">Отправляйте <span>подарки</span> своим друзьям и родственникам</span>
                            </div>

                            <div className="AdvantageContainer column">
                                <div className="imageAdvantage">
                                    <img src={image4} alt=""/>
                                </div>
                                <span className="cardHeader" >Общение</span>
                                <span className="cardDescription"><span>Общайтесь</span> о чём угодно и с кем угодно</span>
                            </div>

                            <div className="AdvantageContainer column">
                                <div className="imageAdvantage">
                                    <img src={image5} alt=""/>
                                </div>
                                <span className="cardHeader" >Социальность</span>
                                <span className="cardDescription">Групповые чаты до <span>200 000 участников</span> одновременно</span>
                            </div>

                            <div className="AdvantageContainer column">
                                <div className="imageAdvantage">
                                    <img src={image6} alt=""/>
                                </div>
                                <span className="cardHeader" >Печеньки</span>
                                <span className="cardDescription">У нас есть вкусные <span>печеньки</span> для каждого</span>
                            </div>
                            <div className="AdvantageContainer column">
                                <div className="imageAdvantage">
                                    <img src={image7} alt=""/>
                                </div>
                                <span className="cardHeader" >Мощность</span>
                                <span className="cardDescription">Мощные  <span>сервера</span> которые выдержут любоё ваше сообщение</span>
                            </div>
                            <div className="AdvantageContainer column">
                                <div className="imageAdvantage">
                                    <img src={image8} alt=""/>
                                </div>
                                <span className="cardHeader" >Бесконечность</span>
                                <span className="cardDescription">Бесконечный обмен <span>сообщениями</span> с друзьями и родственниками из любой страны</span>
                            </div>
                            <div className="AdvantageContainer column">
                                <div className="imageAdvantage">
                                    <img src={image9} alt=""/>
                                </div>
                                <span className="cardHeader" >Эволюция</span>
                                <span className="cardDescription">Проект <span>эволюционирует</span> каждый день <span>специально для вас</span></span>
                            </div>
                            <div className="AdvantageContainer column">
                                <div className="imageAdvantage">
                                    <img src={image10} alt=""/>
                                </div>
                                <span className="cardHeader" >Акула</span>
                                <span className="cardDescription">А также у нас есть <span>АКУЛА</span></span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );  
    }
}

export default MainPage;
