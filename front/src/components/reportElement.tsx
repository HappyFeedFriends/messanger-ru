import moment from 'moment';
import React from 'react';
import { FormattedMessage } from 'react-intl';
import { connect, ConnectedProps } from 'react-redux';
import { RootState } from '../redux/rootReducer';
import '../styles/user_statistics.scss'
import MessageRow from './MessageRow';

interface ReportElementProps{

    date : Date,
    Author : string,
    theme : string,
    text : string,

}
interface ReportElementState{
    isFull : boolean
}

class ReportElement extends React.Component<PropsFromRedux,ReportElementState>{

    loading = false

    constructor(props : PropsFromRedux){
        super(props)
        this.state = {
            isFull : false,
        }

    }

    render(){
        return (
            <div className="ReportElement" data-full={this.state.isFull}>
                <div className="ReportHeader row" onClick={() => this.setState({isFull : !this.state.isFull})}>
                    <div className="row">
                        <span>{moment(this.props.date).locale(this.props.lang).calendar()}</span>
                        <span>{this.props.Author}</span>
                        <span> <FormattedMessage id={this.props.theme} defaultMessage={this.props.theme} /></span>
                    </div>
                    {/* <div className="row statusReport">
                        <span>СТАТУС:</span>
                        <span className="StatusContent">Ожидание</span>
                    </div> */}
                </div>
                <div className="ReportContent column">
                    <span className="column">{this.props.text}</span>
                    {/* <div className="row">
                        <button>Закрыть</button>
                    </div> */}
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

const connector = connect(mapStateToProps,{})
type PropsFromRedux = ConnectedProps<typeof connector> & ReportElementProps

export default connector(ReportElement)
