import React from "react";
import { FormattedMessage } from "react-intl";
import '../../styles/user_statistics.scss'
import ReportElement from "../reportElement";

interface ReportElementsProps{}
interface ReportElementsState{
    reports : FeedBackAPIData[]
}

class BugReports extends React.Component<ReportElementsProps,ReportElementsState>{
    loading = false;
    constructor(props : ReportElementsProps){
        super(props)
        this.state = {
            reports : [],
        }

    }

    LoadingData(){
        if (this.loading) return;
        this.loading = true
        fetch('http://localhost:8080/api/feedback/reports',{
            credentials : 'include',
        }).then(res => res.json()).then((value : ResponseGeneric<FeedBackAPIData[]>) => {
            console.log(value.data[0])
            this.setState({
                reports : value.data[0]
            })
            this.loading = false
        })
    }

    render(){

        this.LoadingData()

        return (
            <div className="FeedBack error column">
                <h1 className="categoryHeader"><FormattedMessage id={'user_bug_report'}/></h1>
                <div className="ReportsContainer column">
                    {this.state.reports.map(value => {
                            return <ReportElement date={value.created_at} text={value.text} theme={value.theme} Author={value.username} key={value.id} />
                    })}
                </div>
            </div>
        )

    }
}

export default BugReports 