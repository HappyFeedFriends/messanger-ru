import React from "react"
import '../../styles/user_language.scss'
import english_flag from '../../images/flags/english.png'
import russian_flag from '../../images/flags/russian.png'
import { FormattedMessage } from "react-intl"
import { connect, ConnectedProps } from "react-redux"
import { RootState } from "../../redux/rootReducer"
import { AppUserLanguageAction } from "../../redux/actions"
import RadioSelector from "../selector"

class UserLanguage extends React.Component<PropsFromRedux>{

    languages(){
        return [
            {
                lang : 'en',
                flag : english_flag,
            },
            {
                lang : 'ru',
                flag : russian_flag,
            },
        ]
    }

    FlagComponent(flag : string, code : string){
        return (
            <div className="translateName_flag row">
                <span className="translateName"> 
                    <FormattedMessage defaultMessage={'lang_' + code} id={'lang_' + code}/> 
                </span>
                <img src={flag} alt=""/>
            </div>
        )
    }

    LanguageComponent(flag : string, code : string){
        return (

            <RadioSelector 
            key={'lang_' + code} 
            onClick={() => this.props.AppUserLanguageAction(code)} 
            isSelect={code === this.props.lang}
            leftText={'real_lang_' + code}
            rightElement={this.FlagComponent(flag,code)}
            />
        )
    }

    render(){
        return (
            <div className="UserLanguage">
                <h1 className="categoryHeader"><FormattedMessage id={'user_settings_app_lang'}/></h1>
                <div className="LanguageContent column">
                    <h2 className="SubHeader" ><FormattedMessage id={'user_settings_app_lang_sub'}/></h2>
                    {this.languages().map(data => {
                        return this.LanguageComponent(data.flag,data.lang)
                    })}
                </div>
            </div>
        )
    }
}

const mapStateToProps = (state : RootState) => {
    return {
        lang : state.APPReducer.lang
    };
}

const connector = connect(mapStateToProps,{
    AppUserLanguageAction
})
type PropsFromRedux = ConnectedProps<typeof connector>

export default connector(UserLanguage)