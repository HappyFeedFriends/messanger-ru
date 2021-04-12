import React from 'react';
import { NavLink, RouteComponentProps } from 'react-router-dom';
import { ResponseSignIn, SignInFormData, SignResponse } from '../../../global/types';
import '../styles/signin.scss';

interface SignInStates {
    isLoading : boolean,
    dataErrorCodes : Array<SignResponse>
}

class signIn extends React.Component<RouteComponentProps,SignInStates>{

    email : HTMLInputElement | undefined | null;
    username : HTMLInputElement | undefined | null;
    password : HTMLInputElement | undefined | null;
    date : HTMLInputElement | undefined | null;

    OnSubmit(event : React.FormEvent<HTMLFormElement>){

        event.preventDefault();
        if (!this.email || !this.date || !this.password || !this.username || this.state.isLoading) return;

        this.setState({
            isLoading : true
        })

        fetch('http://localhost:8080/auth/signin',{
            credentials : 'include',
            method : 'POST',
            headers : {
                'Content-Type' : 'application/json',
            },
            body : JSON.stringify({
                username : this.username.value,
                date : this.date.value as unknown as Date,
                email : this.email.value,
                password : this.password.value,
            } as SignInFormData),
        })
        .then(res => {
            if (res.status !== 200){
                throw new Error(res.status.toString())
            }
            return res;
        })
        .then(res => res.json())
        .then((res : ResponseSignIn) => {

            if (res.errorCode === -1){
                this.props.history.push('/channel')
                return;
            }

            this.setState({
                dataErrorCodes : res.data,
                isLoading : false
            })

        })
        .catch(() => {
            this.setState({
                isLoading : false
            })
        })


    }

    constructor(props : RouteComponentProps){
        super(props)
        this.state = {
            isLoading : false,
            dataErrorCodes : [],
        }
    }

    FindCodeData(errorCode : number){
        return this.state.dataErrorCodes.find(data => data.errorCode === errorCode)
    }

    render(){
        return (
            <div className="column SignInPage">
                
                <form onSubmit={(e) => this.OnSubmit(e)} className="column">
                    <h1 className="header" >Создать учётную запись</h1>

                    <div className="column row_form EmailContainer">
                        <div className="form_input_header row" data-error={!!this.FindCodeData(0)}>
                            <span>E-Mail</span>
                            <div className="row">
                                <span>-</span>
                            </div>
                            <div className="row"> 
                                <span>{this.FindCodeData(0)?.errorDescription}</span>
                            </div>
                        </div>
                        <input pattern="[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$" title="example@example.com" ref={(e) => {this.email = e}} type="email" name="email" required/>
                    </div>

                    <div className="column row_form UsernameContainer" >
                        <div className="form_input_header row" data-error={!!this.FindCodeData(4) || !!this.FindCodeData(3)}>
                            <span>Имя пользователя</span>
                            <div className="row">
                                <span>-</span>
                            </div>
                            <div className="row"> 
                                <span>{this.FindCodeData(3)?.errorDescription || this.FindCodeData(4)?.errorDescription}</span>
                            </div>
                        </div>
                        <input ref={(e) => {this.username = e}} type="username" name="username" required/>
                    </div>

                    <div className="column row_form PasswordContainer">
                        <div className="form_input_header row" data-error={!!this.FindCodeData(1)}>
                            <span>Пароль</span>
                            <div className="row">
                                <span>-</span>
                            </div>
                            <div className="row"> 
                                <span>{this.FindCodeData(1)?.errorDescription}</span>
                            </div>
                        </div>
                        <input ref={(e) => {this.password = e}} type="password" name="password" required/>
                    </div>

                    <div className="column row_form DateContainer">
                        <div className="form_input_header row" data-error={!!this.FindCodeData(2)}>
                            <span>Дата Рождения</span>
                            <div className="row">
                                <span>-</span>
                            </div>
                            <div className="row"> 
                                <span>{this.FindCodeData(2)?.errorDescription}</span>
                            </div>
                        </div>
                        <input ref={(e) => {this.date = e}} type="date" name="date" required/>
                    </div>

                    <button type="submit" className="row_form next" >
                        {/* <span>Продолжить</span> */}
                        {this.state.isLoading 
                            ? <div className="lds-ellipsis"><div></div><div></div><div></div><div></div></div> // from https://loading.io/css/
                            : <span>Продолжить</span> 
                        }

                    </button>
 
                    <div className="row sign row_form">
                        <NavLink to='/signup'>Уже зарегистрированы?</NavLink>
                    </div>

                    <div className="row_form policy">
                        <div>Регистрируясь, вы соглашаетесь с <NavLink to='/'>Условием Использований</NavLink> и <NavLink to='/'>Политикой Конфиденциальности</NavLink> Shark</div>
                    </div>

                </form>

            </div>
        );  
    }
}
 
export default signIn;
