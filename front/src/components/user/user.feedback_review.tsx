import React from "react";
import { FormattedMessage } from "react-intl";
import '../../styles/feedback.scss'
import DropDownMenu from "../dropdown";
import UserFeedBackError from "./user.feedback_error";


class UserFeedBackReview extends UserFeedBackError{
    
    type : string = 'review'

    GetThemesData(){
        return [
            'feedback_review_happy',
            'feedback_review_friendly_interface',
            'feedback_error_not_found',
        ]
    }

    render(){
        return (
            <div className="FeedBack error column">
                <h1 className="categoryHeader"><FormattedMessage id={'user_settings_feedback_review'}/></h1>
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

export default UserFeedBackReview