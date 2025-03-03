import React from "react";
import { FormattedMessage } from "react-intl";
import { connect, ConnectedProps } from "react-redux";
import Cookies from "universal-cookie";
import type { ModalWindowEnum } from "../enums";
import { RootState } from "../redux/rootReducer";
import '../styles/UserProfile.scss'
import UserExternal from "./user/user.external";
import UserFeedBackError from "./user/user.feedback_error";
import UserFeedBackReview from "./user/user.feedback_review";
import UserLanguage from "./user/user.language";
import UserPersonalAccount from "./user/user.personal_account";
import BugReports from "./user/user_bug_reports";
 
interface UserProfileProps {
    openModal : (id : ModalWindowEnum, ...args : any) => void;
    CloseMenu : () => void;
} 

interface UserProfileStates{
    CategoryID : UserCategory
}

enum UserCategory{
    USER_CATEGORY_PERSONAL_ACCOUNT = 0,
    USER_CATEGORY_LANGUAGE = 1,
    USER_CATEGORY_EXTERNAL = 2,
    USER_CATEGORY_FEEDBACK_ERROR = 3,
    USER_CATEGORY_FEEDBACK_REVIEW = 4,

    USER_CATEGORY_STATISTICS = 5,
    USER_CATEGORY_ADMIN = 6,
    USER_CATEGORY_BUG_REPORTS = 7,
    USER_CATEGORY_SETTINGS_DEBUG = 8,
}

class UserProfile extends React.Component<PropsFromRedux,UserProfileStates>{
 
    constructor(props : PropsFromRedux){
        super(props)

        this.state = {
            CategoryID : UserCategory.USER_CATEGORY_PERSONAL_ACCOUNT,
        }
    }

    GetCategoryComponent(){
        switch (this.state.CategoryID) {
            case UserCategory.USER_CATEGORY_LANGUAGE:
                return <UserLanguage/>;
            case UserCategory.USER_CATEGORY_EXTERNAL:
                return <UserExternal/>
            case UserCategory.USER_CATEGORY_FEEDBACK_ERROR:
                return <UserFeedBackError />
            case UserCategory.USER_CATEGORY_FEEDBACK_REVIEW:
                return <UserFeedBackReview />
            case UserCategory.USER_CATEGORY_BUG_REPORTS:
                return <BugReports /> 
            default:
                return <UserPersonalAccount openModal={this.props.openModal} />;
        }
    }

    OpenCategory(id : UserCategory){

        this.setState({
            CategoryID : id,
        })

    }

    ButtonCategorySelect(categoryID : UserCategory,text : string){
        return (
            <button 
            data-select={this.state.CategoryID === categoryID} 
            onClick={(e) => this.OpenCategory(categoryID)}>
                <FormattedMessage defaultMessage={text} id={text}/>
            </button>
        )
    }

    DevComponent(){
        return (
        <div className="category column">
            <span className="category_header">Разработчик</span>
            <ul className="column category_list"> 
            {this.ButtonCategorySelect(UserCategory.USER_CATEGORY_BUG_REPORTS,'user_bug_report')}
            </ul>
        </div>
        )
    }

    render(){
        return (
            <div className="row UserProfile">
                <div className="navbar column">
                    <div className="category column">
                        <span className="category_header"><FormattedMessage id={'user_settings_header'}/></span>
                        <ul className="column category_list">
                            {this.ButtonCategorySelect(UserCategory.USER_CATEGORY_PERSONAL_ACCOUNT,'user_settings_account')}
                            {/* <button ><FormattedMessage id={'user_settings_privacy'}/></button> */}
                        </ul>
                    </div>

                    <div className="category column">
                        <span className="category_header"><FormattedMessage id={'user_settings_app_header'}/></span>
                        <ul className="column category_list">
                            {this.ButtonCategorySelect(UserCategory.USER_CATEGORY_LANGUAGE,'user_settings_app_lang')}
                            {this.ButtonCategorySelect(UserCategory.USER_CATEGORY_EXTERNAL,'user_settings_app_external')}
                        </ul>
                    </div>

                    <div className="category column">
                        <span className="category_header"><FormattedMessage id={'user_settings_feedback_header'}/></span>
                        <ul className="column category_list">
                            {this.ButtonCategorySelect(UserCategory.USER_CATEGORY_FEEDBACK_ERROR,'user_settings_feedback_error')}
                            {this.ButtonCategorySelect(UserCategory.USER_CATEGORY_FEEDBACK_REVIEW,'user_settings_feedback_review')}
                        </ul>
                    </div>
                    {this.props.User.IsAdmin && this.DevComponent()}
                    <div className="category column">
                        <ul className="column category_list">
                            <button className="quit" onClick={e => {  new Cookies().remove('auth', { path: '/' }); window.location.reload()}} ><FormattedMessage id={'user_settings_quit'}/></button>
                        </ul>
                    </div>

                    <div className="socialLinks row">
                        <a title="Twitter" href="https://twitter.com/discord">
                            <svg width="20" height="16" viewBox="0 0 20 16" aria-hidden="true"><g fill="none" fillRule="evenodd"><path fill="currentColor" d="M1,14.1538462 L1.95,14.1538462 C3.73125,14.1538462 5.5125,13.5384615 6.81875,12.4307692 C5.15625,12.4307692 3.73125,11.2 3.1375,9.6 C3.375,9.6 3.6125,9.72307692 3.85,9.72307692 C4.20625,9.72307692 4.5625,9.72307692 4.91875,9.6 C3.1375,9.23076923 1.7125,7.63076923 1.7125,5.66153846 C2.1875,5.90769231 2.78125,6.15384615 3.49375,6.15384615 C2.425,5.41538462 1.83125,4.18461538 1.83125,2.70769231 C1.83125,1.96923077 2.06875,1.23076923 2.30625,0.615384615 C4.20625,3.07692308 7.05625,4.67692308 10.38125,4.8 C10.2625,4.67692308 10.2625,4.30769231 10.2625,4.06153846 C10.2625,1.84615385 12.04375,0 14.18125,0 C15.25,0 16.31875,0.492307692 17.03125,1.23076923 C17.8625,1.10769231 18.8125,0.738461538 19.525,0.246153846 C19.2875,1.23076923 18.575,1.96923077 17.8625,2.46153846 C18.575,2.46153846 19.2875,2.21538462 20,1.84615385 C19.525,2.70769231 18.8125,3.32307692 18.1,3.93846154 L18.1,4.43076923 C18.1,9.84615385 14.18125,16 6.9375,16 C4.68125,16 2.6625,15.3846154 1,14.1538462 Z"></path><rect width="20" height="16"></rect></g></svg>
                        </a>
                        <a title="Facebook" href="https://www.facebook.com/discord/">
                            <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden="true"><g fill="none" fillRule="evenodd"><path fill="currentColor" d="M0,1.99406028 C0,0.892771196 0.894513756,0 1.99406028,0 L14.0059397,0 C15.1072288,0 16,0.894513756 16,1.99406028 L16,14.0059397 C16,15.1072288 15.1054862,16 14.0059397,16 L1.99406028,16 C0.892771196,16 0,15.1054862 0,14.0059397 L0,1.99406028 Z M8.23182341,16 L10.3991764,16 L10.3991764,9.93141161 L12.5663127,9.93141161 L13,7.76405862 L10.3991764,7.76405862 L10.3246195,6.3468265 C10.3246195,5.66107601 10.5049432,5.17342158 11.4698488,5.17342158 L12.974642,5.17385505 L12.974642,3.12202197 C12.7618079,3.09319618 12.3142495,3 11.4644304,3 C9.69001851,3 8.18500859,4.20353112 8.18500859,6.23043964 L8.23182341,7.76405862 L6.06425368,7.76405862 L6.06425368,9.93141161 L8.23182341,9.93141161 L8.23182341,16 Z"></path><rect width="16" height="16"></rect></g></svg>
                        </a>
                        <a title="Instagram" href="https://www.instagram.com/discord/">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" aria-hidden="true"><g fill="none" fillRule="evenodd"><path  fill="currentColor" d="M4.70012698,0.0531746 C3.84888888,0.092 3.2675238,0.22720635 2.7588254,0.42492063 C2.23292063,0.62926983 1.78692063,0.90273016 1.3422857,1.34733333 C0.89768254,1.79196825 0.62422222,2.23796825 0.41987302,2.76387303 C0.22215872,3.27257143 0.08695238,3.85393651 0.04812698,4.7051746 C0.00920635,5.55819048 0,5.83053968 0,8.00253968 C0,10.1745079 0.00920635,10.4468571 0.04812698,11.299873 C0.08695238,12.1511111 0.22215873,12.7324762 0.41987302,13.2411746 C0.62422222,13.7670794 0.89768254,14.2130794 1.34228572,14.6577143 C1.78692062,15.1023175 2.23292062,15.3757778 2.7588254,15.5801587 C3.2675238,15.7778413 3.8488889,15.9130476 4.70012698,15.951873 C5.55314286,15.9907937 5.82549206,16 7.99749206,16 C10.1694603,16 10.4418095,15.9907937 11.2948254,15.951873 C12.1460635,15.9130476 12.7274286,15.7778413 13.236127,15.5801587 C13.7620317,15.3757778 14.2080317,15.1023175 14.6526667,14.6577143 C15.0972698,14.2130794 15.3707302,13.7670794 15.5751111,13.2411746 C15.7727937,12.7324762 15.908,12.1511111 15.9468254,11.299873 C15.985746,10.4468571 15.9949524,10.1745079 15.9949524,8.00253968 C15.9949524,5.83053968 15.985746,5.55819048 15.9468254,4.7051746 C15.908,3.8539365 15.7727937,3.27257143 15.5751111,2.76387302 C15.3707302,2.23796825 15.0972698,1.79196825 14.6526667,1.34733332 C14.2080317,0.90273016 13.7620317,0.62926984 13.236127,0.42492064 C12.7274286,0.22720634 12.1460635,0.092 11.2948254,0.0531746 C10.4418095,0.01425397 10.1694603,0.00504762 7.99749206,0.00504762 C5.82549206,0.00504762 5.55314286,0.01425397 4.70012698,0.0531746 L4.70012698,0.0531746 Z M8.00001453,2.00504762 C9.95416635,2.00504762 10.185649,2.01251386 10.9573741,2.04772432 C11.6709381,2.08026206 12.0584565,2.19948958 12.3163471,2.29971739 C12.6579641,2.43248289 12.9017646,2.59107525 13.157854,2.84719363 C13.4139723,3.10328295 13.5725647,3.34708347 13.7053302,3.68870053 C13.805558,3.94659105 13.9247856,4.33410953 13.9573233,5.04767346 C13.9925338,5.8193986 14,6.05088127 14,8.00506213 C14,9.95921396 13.9925338,10.1906966 13.9573233,10.9624217 C13.9247856,11.6759857 13.805558,12.0635042 13.7053302,12.3213947 C13.5725647,12.6630117 13.4139723,12.9068123 13.157854,13.1629016 C12.9017646,13.41902 12.6579641,13.5776123 12.3163471,13.7103779 C12.0584565,13.8106057 11.6709381,13.9298332 10.9573741,13.9623709 C10.1857652,13.9975814 9.9543116,14.0050476 8.00001453,14.0050476 C6.04568839,14.0050476 5.81426383,13.9975814 5.04262587,13.9623709 C4.32906195,13.9298332 3.94154347,13.8106057 3.68365294,13.7103779 C3.34203588,13.5776123 3.09823536,13.41902 2.84214604,13.1629016 C2.58605671,12.9068123 2.42743531,12.6630117 2.29466977,12.3213947 C2.19444197,12.0635042 2.07521444,11.6759857 2.04267671,10.9624217 C2.00746628,10.1906966 2,9.95921395 2,8.00506212 C2,6.05088125 2.00746625,5.81939858 2.0426767,5.04767347 C2.07521444,4.33410953 2.19444196,3.94659104 2.29466977,3.68870052 C2.42743531,3.34708346 2.58602767,3.10328294 2.84214604,2.84719362 C3.09823536,2.59107524 3.34203588,2.43248288 3.68365294,2.29971735 C3.94154346,2.19948953 4.32906194,2.08026201 5.04262587,2.04772428 C5.81435097,2.01251381 6.04583365,2.00504758 8.00001453,2.00504758 L8.00001453,2.00504762 Z"></path><path fill="currentColor" d="M8.0000119,10 C6.89542535,10 6,9.10457466 6,8.0000119 C6,6.89542535 6.89542534,6 8.0000119,6 C9.10457467,6 10,6.89542534 10,8.0000119 C10,9.10457467 9.10457466,10 8.0000119,10 L8.0000119,10 Z M8.00001546,4 C5.7908468,4 4,5.7908468 4,8.00001546 C4,10.2091532 5.7908468,12 8.00001546,12 C10.2091532,12 12,10.2091532 12,8.00001546 C12,5.7908468 10.2091532,4 8.00001546,4 L8.00001546,4 Z M13,4.00001654 C13,4.55230644 12.5522734,5 11.9999835,5 C11.4477266,5 11,4.55230645 11,4.00001654 C11,3.44772664 11.4477266,3 11.9999835,3 C12.5522734,3 13,3.44772663 13,4.00001654 L13,4.00001654 Z"></path><rect width="16" height="16"></rect></g></svg>
                        </a>
                    </div>

                </div>

                <div className="user_content">
                    {this.GetCategoryComponent()}
                </div>
                {/* TODO: Added logic closed menu */}
                <div className="close_container row">
                    <button onClick={e => this.props.CloseMenu()} className="row">
                        <svg aria-hidden="true" width="24" height="24" viewBox="0 0 24 24"><path fill="#dcddde" d="M18.4 4L12 10.4L5.6 4L4 5.6L10.4 12L4 18.4L5.6 20L12 13.6L18.4 20L20 18.4L13.6 12L20 5.6L18.4 4Z"></path></svg>
                    </button>
                </div>
            
            </div>
        );
    }

}
const mapStateToProps = (state : RootState) => {
    return { 
        User : state.APPReducer.user
    };
}

const connector = connect(mapStateToProps)

type PropsFromRedux = ConnectedProps<typeof connector> & UserProfileProps

export default connector(UserProfile)