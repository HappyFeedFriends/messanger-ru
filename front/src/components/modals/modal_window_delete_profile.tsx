import React from "react"
import { FormattedMessage } from "react-intl"
import Cookies from "universal-cookie"
import '../../styles/modal_window_delete_profile.scss'

interface ModalWindowDeletePrifleProps{
    closeModel : () => void;
}

class ModalWindowDeletePrifle extends React.Component<ModalWindowDeletePrifleProps>{

    DeleteAccount(){

        fetch('http://localhost:8080/api/user_update/',{
            method : 'DELETE',
            credentials : 'include',
        })
        .then(res => {
            new Cookies().remove('auth')
            window.location.reload()
        })

    }

    render(){
        return (
            <div className="ModalWindowDeleteProfile column">
                <div className="DeleteProfileHeader">
                    <h1><FormattedMessage id="delete_account" /></h1>
                </div>
                <div className="DeleteProfileContent row">
                    <span> <FormattedMessage id="delete_account_success" /> </span>
                </div>
                <div className="DeleteProfileFooter row">
                    <button onClick={(e) => this.props.closeModel()} ><FormattedMessage id="cancel" /></button>
                    <button onClick={e => this.DeleteAccount()} ><FormattedMessage id="delete" /></button>
                </div>
            </div>
        )
    }

}

export default ModalWindowDeletePrifle