import React from "react";
import { FormattedMessage } from "react-intl";
import { FeedbackData, ResponseDataExample } from "../../../../global/types";
import '../../styles/feedback.scss'
import DropDownMenu, { DropMenuDataOnChange } from "../dropdown";

interface UserFeedBackErrorStates{
    theme : string,
    customTheme : string,
    text : string,
    errorType : number,
    errorMessage : string,
    isRequest : boolean,
}

class UserFeedBackError extends React.Component<{},UserFeedBackErrorStates>{
    
    DropDownMenu? : DropDownMenu | null
    type : string = 'error'

    constructor(props : {}){
        super(props)

        this.state = {
            theme : this.GetThemesData()[0],
            customTheme : '',
            text : '',
            errorMessage : '',
            isRequest : false,
            errorType : -1,
        }
    }

    GetThemesData(){
        return [
            'feedback_error_interface',
            'feedback_error_localize',
            'feedback_error_app',
            'feedback_error_not_found',
        ]
    }

    OnSelect(e : React.ChangeEvent<HTMLSelectElement>){

    }

    OnSelectDropMenu(data : DropMenuDataOnChange){
        this.setState({
            theme : data.value,
        }) 

    }

    OnClearForm(){
        this.setState({
            theme : this.GetThemesData()[0],
            customTheme : '',
            text : '',
            errorMessage : '',
            isRequest : false,
            errorType : -1,
        })

        if (this.DropDownMenu){
            this.DropDownMenu.Refresh()
        }
    }

    OnSendForm(){

        const themeName = this.state.theme === 'feedback_error_not_found' ? this.state.customTheme : this.state.theme
        if (this.state.text === ''){

            return this.setState({
                errorType : 0,
                errorMessage : 'Поле обязательно для ввода!'
            })
        }

        if (themeName === ''){

            return this.setState({
                errorType : 1,
                errorMessage : 'Поле обязательно для ввода!'
            })
        }

        this.setState({
            isRequest : true,
        })

        fetch('http://localhost:8080/api/feedback/' + this.type,{
            method : 'POST',
            credentials : 'include',
            headers : {
                'Content-Type' : 'application/json',
            },
            body : JSON.stringify({
                text : this.state.text,
                theme : themeName
            } as FeedbackData),
        })
        .then(res => {
            if (res.status !== 200) return new Error(res.status.toString());
            return res.json()
        })
        .then((res : ResponseDataExample) => {
            
            if (res.errorCode === -1){
                this.OnClearForm()
            }else{
                this.setState({
                    errorType : res.errorCode,
                    isRequest : false,
                    errorMessage : res.errorMessage,
                })
            }
        })
        .catch((err) => {
            this.setState({
                errorType : -1,
                isRequest : false,
            })
        })
    }

    render(){
        return (
            <div className="FeedBack error column">
                <h1 className="categoryHeader"><FormattedMessage id={'user_settings_feedback_error'}/></h1>
                <div className="containerFeedBack column">
                    <div className="column headerFeedBack">
                        <h2><FormattedMessage id='feedback_theme_message' /> </h2>
                        <DropDownMenu ref={(ref) => {this.DropDownMenu = ref}} onChange={(data) => this.OnSelectDropMenu(data)} isLocalize={true} items={this.GetThemesData()} />
                        {
                            this.state.errorType === 1 && (
                                <div className="row" ><span className="errorBlock">{this.state.errorMessage}</span></div>
                            )
                        }
                        {this.state.theme === 'feedback_error_not_found' &&
                            (<div className="row inputCustomTheme">
                                <input placeholder="Введите тему..." onInput={(e) => this.setState({customTheme : e.currentTarget.value})} maxLength={48} defaultValue={this.state.customTheme} />
                            </div>)
                        }
                    </div>
                    <div className="FeedBackMessageMainBlock column">
                        {
                            this.state.errorType === 0 && (
                                <div className="row"><span className="errorBlock">{this.state.errorMessage}</span></div>
                            )
                        }
                        <textarea onChange={e => this.setState({text : e.currentTarget.value})} value={this.state.text} maxLength={4500} /> 
                    </div>
                    <div className="buttons row">
                        <button className="button_clear" onClick={e => this.OnClearForm()}>
                            <span> <FormattedMessage id="clear_feedback" /> </span>
                        </button>
                        <button className="button_send" onClick={e => this.OnSendForm()}>
                            {
                                this.state.isRequest 
                                ? (<div className="lds-ellipsis"><div></div><div></div><div></div><div></div></div>)
                                : <span> <FormattedMessage id="send" /> </span>
                            }
                        </button>
                    </div>
                </div>
            </div>
        )

    }
}

export default UserFeedBackError