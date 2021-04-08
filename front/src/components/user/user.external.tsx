import React from "react";
import { FormattedMessage } from "react-intl";
import { ConnectedProps,connect } from "react-redux";
import { RootState } from "../../redux/rootReducer";
import '../../styles/user_external.scss'
import MessageRow from "../MessageRow";

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
                <div className="ExternalPreviewContainer column">
                    {this.GetPseudoMessages().map((value) => {
                        return <MessageRow IsPseudoMessage={true} key={'message_row_' + value.id} IsDuplicate={false} messageData={value} />
                    })}
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