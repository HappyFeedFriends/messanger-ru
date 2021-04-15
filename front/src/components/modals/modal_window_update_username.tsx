import React from "react";
import { FormattedMessage } from "react-intl";
import { connect, ConnectedProps } from "react-redux";
import { StorageUserUpdate } from "../../redux/actions";
import { RootState } from "../../redux/rootReducer";
import '../../styles/modal_window_update_username.scss'

interface ModalWindowUpdateUserNameProps{
    username : string
    CloseModal : () => void;
}
 
export interface ModalWindowUpdateUserNameStates{
    isSubmit : boolean,
    username : string,
    password : string,
    errorCode : number,
    errorMessage : string,
}

class ModalWindowUpdateUserName extends React.Component<PropsFromRedux,ModalWindowUpdateUserNameStates>{

    type = 'username'

    constructor(props : PropsFromRedux){
        super(props)

        this.state = {
            isSubmit : false,
            username : props.username,
            password : '',
            errorCode : -1,
            errorMessage : '',
        }
    }

    OnSubmitData(){
        if (this.state.isSubmit) return;

        if (this.state.username === ''){

            return this.setState({
                errorCode : 1,
                errorMessage : 'Поле обязательно для ввода!'
            })
        }

        if (this.state.password === ''){

            return this.setState({
                errorCode : 0,
                errorMessage : 'Поле обязательно для ввода!'
            })
        }

        this.setState({
            isSubmit : true
        })

        fetch('http://localhost:8080/api/user_update/' + this.type,{
            method : 'POST',
            credentials : 'include',
            headers : {
                'Content-Type' : 'application/json',
            },
            body : JSON.stringify({
                username : this.state.username,
                password : this.state.password,
            }),
        })        
        .then(res => {
            if (res.status !== 200) return new Error(res.status.toString());
            return res.json()
        })
        .then((res : ResponseDataExample) => {

            if (res.errorCode === -1){
                this.props.StorageUserUpdate(res.data[0])
                this.props.CloseModal();
                return;
            }

            this.setState({
                isSubmit : false,
                errorMessage : res.errorMessage,
                errorCode : res.errorCode,
            })
        })
        .catch(err => {

            this.setState({
                isSubmit : false,
            })
        })
    } 
    
    render(){
        return (
            <div className="ModalWindowUpdateUserName column">
                <h1>Измените имя пользователя</h1>
                <span>Введите новое имя пользователя и текущий пароль</span>
                <div className="InputsContainer column">
                    <div className="column">
                        <span>Имя пользователя</span>
                        { this.state.errorCode === 1 && (
                            <div className="row"><span className="errorBlock" >{this.state.errorMessage}</span></div>
                        )}
                        <input type="text" onChange={(e) => { if (this.state.isSubmit) return;  this.setState({username : e.currentTarget.value})} } value={this.state.username} />
                    </div>
                    <div className="column">
                        <span>Текущий пароль</span>
                        { this.state.errorCode === 0 && (
                            <div className="row"><span className="errorBlock" >{this.state.errorMessage}</span></div>
                        )}
                        <input type="password" onChange={(e) => { if (this.state.isSubmit) return; this.setState({password : e.currentTarget.value})} } value={this.state.password}/>
                    </div>
                </div>
                <div className="footerUpdateUsername row">
                    <button onClick={() => {if (this.state.isSubmit) return; this.props.CloseModal()}} >Отмена</button>
                    <button onClick={() => this.OnSubmitData()}>
                    {
                        this.state.isSubmit 
                        ? (<div className="lds-ellipsis"><div></div><div></div><div></div><div></div></div>)
                        : <FormattedMessage id="done" />
                    }
                    </button>
                </div>
            </div>
        )
    }

}

const mapStateToProps = (state : RootState) => {
    return {};
}

const connector = connect(mapStateToProps,{
    StorageUserUpdate
})
type PropsFromRedux = ConnectedProps<typeof connector> & ModalWindowUpdateUserNameProps

export default connector(ModalWindowUpdateUserName)
