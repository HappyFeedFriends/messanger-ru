import React from "react"
import { FormattedMessage } from "react-intl"
import '../styles/selector.scss'

interface SelectorProps{

    isSelect : boolean,
    leftText? : string
    rightElement? : JSX.Element
    onClick? : (event : React.MouseEvent<HTMLDivElement, MouseEvent>) => void;
    
}

class RadioSelector extends React.Component<SelectorProps>{

    render(){
        return (
            <div onClick={(e) => this.props.onClick && this.props.onClick(e)} data-select={this.props.isSelect} className="RadioSelector column">
            <div className="SelectorContainer row">
                <div className="dot_realName row">
                    <div className="dot" >
                        <div className="dot_ring" />
                    </div>
                    <span className="realName"> 
                        <FormattedMessage defaultMessage={this.props.leftText} id={this.props.leftText}/>  
                    </span>
                </div>
                {this.props.rightElement}
            </div>
        </div>
        )
    }

}

export default RadioSelector