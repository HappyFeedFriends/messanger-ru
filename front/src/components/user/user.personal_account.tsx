import React from "react";
import { FormattedMessage } from "react-intl";
import { connect, ConnectedProps } from "react-redux";
import type { UserLocalData } from "../../../../global/types";
import { ModalWindowEnum } from "../../enums";
import { RootState } from "../../redux/rootReducer";
import '../../styles/UserPersonalAccount.scss'

interface UserPersonalAccountState {
    user : UserLocalData | undefined, 
}

interface UserPersonalAccountProps{
    openModal : (id : ModalWindowEnum,...args : any) => void;
}

class UserPersonalAccount extends React.Component<PropsFromRedux,UserPersonalAccountState>{
    
    GetUserData(){
        return this.props.Users.find((data) => data.id === this.props.UserData.id)
    }

    constructor(props : PropsFromRedux){
        super(props);
        this.state = {
            user : this.GetUserData()
        }
    }

    render(){
        return (
            <React.StrictMode>
            <div className="UserPersonalAccount column">
                <h1 className="categoryHeader"><FormattedMessage id={'user_settings_account'}/></h1>
                <div className="UserPersonalAccountCard column">
                    <div className="UserProfileMain row">
                        <div className="UserIcon column">
                            <img className="avatar" src={this.state.user?.Url} alt=""/> 
                            <span className="avatar_update column">
                                <span><FormattedMessage id='update_avatar' /></span>
                            </span>
                            <div className="UploaderIndicator">
                                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 18 18">
                                    <g fill="none" fillRule="evenodd">
                                        <rect width="18" height="18"/>
                                        <path fill="#4F545C" d="M13.5,8.25 L13.5,12.75 C13.5,13.5784271 12.8284271,14.25 12,14.25 L1.5,14.25 C0.671572875,14.25 0,13.5784271 0,12.75 L0,2.25 C0,1.42157288 0.671572875,0.75 1.5,0.75 L9,0.75 L6,0.75 L6,2.25 L1.5,2.25 L1.5,12.75 L12,12.75 L12,8.25 L13.5,8.25 Z M8.22,7.7175 L10.875,11.25 L2.625,11.25 L4.6875,8.6025 L6.1575,10.3725 L8.22,7.7175 Z M12,2.25 L14.25,2.25 L14.25,3.75 L12,3.75 L12,6 L10.5,6 L10.5,3.75 L8.25,3.75 L8.25,2.25 L10.5,2.25 L10.5,0 L12,0 L12,2.25 Z" transform="translate(2.25 1.5)"/>
                                    </g>
                                </svg>
                            </div>
                        </div>
                        <div className="Username">
                            {this.state.user?.username}
                        </div>
                    </div>

                    <div className="settingsUpdate column">
                        <div className="row content">
                            <div className="column containerSetting">
                                <div className="row">
                                    <span className="settingsHeader"><FormattedMessage id='username' /></span>
                                </div>
                                <div className="row">
                                    <span className="settingUsername">{this.state.user?.username}</span>
                                </div>
                            </div>
                            <button onClick={() => this.props.openModal(ModalWindowEnum.MODAL_WINDOW_UPDATE_USER_NAME,this.state.user?.username)} ><FormattedMessage id='update' /></button>
                        </div>
                        <div className="row content">
                            <div className="column containerSetting">
                                <div className="row">
                                    <span className="settingsHeader"><FormattedMessage id='password' /></span>
                                </div>
                                <div className="row">
                                    <span className="settingUsername">**********</span>
                                </div>
                            </div>
                            <button onClick={() => this.props.openModal(ModalWindowEnum.MODAL_WINDOW_UPDATE_PASSWORD)} ><FormattedMessage id='update' /></button>
                        </div>
                        <div className="row content">
                            <div className="column containerSetting">
                                <div className="row">
                                    <span className="settingsHeader"><FormattedMessage id='email' /></span>
                                </div>
                                <div className="row">
                                    <span className="settingUsername">******@***.**</span>
                                </div>
                            </div>
                            <button onClick={() => this.props.openModal(ModalWindowEnum.MODAL_WINDOW_UPDATE_EMAIL)} ><FormattedMessage id='update' /></button>
                        </div>
                    </div>
                </div>
            </div>
            
            <div className="AccountDelete column">
                <h1 className="SubHeader" ><FormattedMessage id='delete_account' /></h1>
                <span><FormattedMessage id='delete_account_sub' /></span>
                {/* <span>Отключив учётную запись, вы в любой момент сможете её восстановить</span> */}
                <div className="buttonsContainer row">
                    {/* <button>Отключить учётную запись</button> */}
                    <button><FormattedMessage id='delete_account_button' /></button>
                </div>
            </div>
            
            </React.StrictMode>
        )
    }
}

const mapStateToProps = (state : RootState) => {
    return { 
        UserData : state.APPReducer.user, 
        Users : state.StorageReducer.users
    };
}

const connector = connect(mapStateToProps,{})
type PropsFromRedux = ConnectedProps<typeof connector> & UserPersonalAccountProps

export default connector(UserPersonalAccount)