import React from "react";
import '../../styles/modal_window_update_username.scss'

interface ModalWindowUpdateUserNameProps{
    username : string
    CloseModal : () => void;
}

interface ModalWindowUpdateUserNameStates{
    isSubmit : boolean,
}

class ModalWindowUpdateUserName extends React.Component<ModalWindowUpdateUserNameProps,ModalWindowUpdateUserNameStates>{

    constructor(props : ModalWindowUpdateUserNameProps){
        super(props)

        this.state = {
            isSubmit : false,
        }
    }

    OnSubmitData(){
        if (this.state.isSubmit) return;

        
    }
    
    render(){
        return (
            <div className="ModalWindowUpdateUserName column">
                <h1>Измените имя пользователя</h1>
                <span>Введите новое имя пользователя и текущий пароль</span>
                <div className="InputsContainer column">
                    <div className="column">
                        <span>Имя пользователя</span>
                        <input type="text" defaultValue={this.props.username}/>
                    </div>
                    <div className="column">
                        <span>Текущий пароль</span>
                        <input type="password"/>
                    </div>
                </div>
                <div className="footerUpdateUsername row">
                    <button onClick={() => {if (this.state.isSubmit) return; this.props.CloseModal()}} >Отмена</button>
                    <button onClick={() => this.OnSubmitData()}>Готово</button>
                </div>
            </div>
        )
    }

}

export default ModalWindowUpdateUserName