import React from 'react';
import { NavLink, RouteComponentProps } from 'react-router-dom';
import { ResponseSignIn, SignResponse, SignUpFormData } from '../../../global/types';
import '../styles/signin.scss';

interface SignInStates {
    isLoading : boolean,
    dataErrorCodes : Array<SignResponse>
}

class signUp extends React.Component<RouteComponentProps,SignInStates>{

    username : HTMLInputElement | undefined | null;
    password : HTMLInputElement | undefined | null;

    OnSubmit(event : React.FormEvent<HTMLFormElement>){

        event.preventDefault();
        if (!this.password || !this.username || this.state.isLoading) return;

        this.setState({
            isLoading : true
        })

        fetch('http://localhost:8080/auth/signup',{
            credentials : 'include',
            method : 'POST',
            headers : {
                'Content-Type' : 'application/json',
            },
            body : JSON.stringify({
                username : this.username.value,
                password : this.password.value,
            } as SignUpFormData),
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
                dataErrorCodes : res.data
            })

        })
        .finally(() => {
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
                    <h1 className="header" >С Возвращением!</h1>

                    <div className="column row_form UsernameContainer" >
                        <div className="form_input_header row" data-error={!!this.FindCodeData(10)}>
                            <span>Имя пользователя</span>
                            <div className="row">
                                <span>-</span>
                            </div>
                            <div className="row"> 
                                <span>{this.FindCodeData(10)?.errorDescription}</span>
                            </div>
                        </div>
                        <input ref={(e) => {this.username = e}} type="username" name="username" required/>
                    </div>

                    <div className="column row_form PasswordContainer">
                        <div className="form_input_header row" data-error={!!this.FindCodeData(10)}>
                            <span>Пароль</span>
                            <div className="row">
                                <span>-</span>
                            </div>
                            <div className="row"> 
                                <span>{this.FindCodeData(10)?.errorDescription}</span>
                            </div>
                        </div>
                        <input ref={(e) => {this.password = e}} type="password" name="password" required/>
                    </div>

                    <button type="submit" className="row_form next" >
                        {this.state.isLoading 
                            ? <div className="lds-ellipsis"><div></div><div></div><div></div><div></div></div> // from https://loading.io/css/
                            : <span>Продолжить</span> 
                        }

                    </button>
 
                    <div className="row_form policy">
                        <div>Нужна учётная запись? <NavLink to='/signin'>Зарегистрироваться</NavLink> </div>
                    </div>

                </form>

            </div>
        );  
    }
}
 
export default signUp;
