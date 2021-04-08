import React from "react";
import '../../styles/modal_window_update_username.scss'

interface ModalWindowUpdateUserNameProps{
    CloseModal : () => void;
}

interface ModalWindowUpdateUserNameStates{
    isSubmit : boolean,
}

class ModalWindowUpdateEmail extends React.Component<ModalWindowUpdateUserNameProps,ModalWindowUpdateUserNameStates>{

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
                <span>Введите адрес электронной почты и текущий пароль</span>
                <div className="InputsContainer column">
                    <div className="column">
                        <span>Адрес электронной почты</span>
                        <input type="email"/>
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

export default ModalWindowUpdateEmail