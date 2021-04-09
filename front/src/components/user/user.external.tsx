import React from "react";
import { FormattedMessage } from "react-intl";
import { ConnectedProps,connect } from "react-redux";
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
        data.push({...example,id : -3,content : 'И жду, когда это закончится'}) 

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
                <div className="ExternalMessageVisibilitySelect column categoryExternal">
                    <h1 className="SubHeader"><FormattedMessage id="message_visibility"/></h1>
                    <div className="column">
                    <RadioSelector isSelect={true} leftText={'text_visible_default'} />
                        <RadioSelector isSelect={false} leftText={'text_visible_compact'} />
                    </div>
                </div>
            </div>
        )
    }

}

const mapStateToProps = (state : RootState) => {
    return { 
        UserData : state.APPReducer.user, 
    };
}

const connector = connect(mapStateToProps,{})
type PropsFromRedux = ConnectedProps<typeof connector>

export default connector(UserExternal)