import React from "react"
import { FormattedMessage } from "react-intl"
import '../styles/status.scss'

export enum StatusCode{
    STATUS_CODE_DEVELOPMENT = 0,
}

interface StatusProps{
    statusCode : StatusCode
}

class Status extends React.Component<StatusProps>{

    render(){
        return (
            <div className="StatusHeader row" data-status={'status_' + this.props.statusCode}>
                <span><FormattedMessage defaultMessage={'status_' + this.props.statusCode} id={'status_' + this.props.statusCode}/></span>
            </div>
        )
    }
}

export default Status