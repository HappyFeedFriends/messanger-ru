import React from "react";
import { FormattedMessage } from "react-intl";
import { ConnectedProps,connect } from "react-redux";
import { AppUserMessageVisibleAction } from "../../redux/actions";
import { RootState } from "../../redux/rootReducer";
import '../../styles/user_external.scss'
import MessageRow from "../MessageRow";
import RadioSelector from "../selector";
import Status, { StatusCode } from "../status";

class UserExternal extends React.Component<PropsFromRedux>{
 
    GetPseudoMessages(){
        const data = []
        const example = {
            created_at : new Date(),
            AuthorID : this.props.UserData.id,
        }
        data.push({...example,id : -1,content : 'Посмотрите на меня, я прекрасная акула!'})
        data.push({...example,id : -2,content : 'Я плаваю при свете солнца!'})
        data.push({...example,id : -3,content : 'И жду, когда закончится....'}) 
        data.push({...example,id : -4,content : 'Ненависть к акулкам'})
        data.push({...example,id : -5,content : 'Лучше посмотри на меня!',Url : 'img4.goodfon.ru/wallpaper/nbig/7/d4/akula-ryba-more-1.jpg' })

        return data
    }

    render(){ 
        return (
            <div className="UserExternal column">
                <h1 className="categoryHeader"><FormattedMessage id={'user_settings_app_external'}/></h1>
                <div className="categoryExternal column">
                    <div className="ExternalPreviewContainer column">
                        {this.GetPseudoMessages().map((value) => {
                            return <MessageRow IsPseudoMessage={true} key={'message_row_' + value.id} IsDuplicate={false} messageData={value} />
                        })}
                    </div>
                </div>
                <div className="ExternalThemeSelect column categoryExternal">
                    <div className="row headerThemeSelect">
                        <h1 className="SubHeader isDevelopment"><FormattedMessage id="theme"/></h1>
                        <Status statusCode={StatusCode.STATUS_CODE_DEVELOPMENT} />
                    </div>
                    <div className="column">
                        <RadioSelector isSelect={true} leftText={'theme_name_dark'} />
                        <RadioSelector isSelect={false} leftText={'theme_name_white'} />
                    </div>
                </div>
                <div className="ExternalMessageVisibilitySelect column">
                    <h1 className="SubHeader"><FormattedMessage id="message_visibility"/></h1>
                    <div className="column">
                        <RadioSelector onClick={() => this.props.AppUserMessageVisibleAction('cozy')} isSelect={this.props.MessageFormat === 'cozy'} leftText={'text_visible_default'} />
                        <RadioSelector onClick={() => this.props.AppUserMessageVisibleAction('compact')} isSelect={this.props.MessageFormat === 'compact'} leftText={'text_visible_compact'} />
                    </div>
                </div>
            </div>
        )
    }

}

const mapStateToProps = (state : RootState) => {
    return { 
        UserData : state.APPReducer.user, 
        MessageFormat : state.APPReducer.messageFormat
    };
}

const connector = connect(mapStateToProps,{
    AppUserMessageVisibleAction
})
type PropsFromRedux = ConnectedProps<typeof connector>

export default connector(UserExternal)