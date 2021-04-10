import React from "react"
import { FormattedMessage } from "react-intl"
import '../styles/dropdown.scss'

export interface DropMenuDataOnChange{
    index : number,
    value : string,

}

interface DropDownMenuProps{

    onChange? : (data : DropMenuDataOnChange) => void;

    items : Array<string>
    isLocalize? : boolean
}

interface DropDownMenuStates {
    IsOpen : boolean,
    selected_id : number,
}

class DropDownMenu extends React.Component<DropDownMenuProps,DropDownMenuStates>{

    constructor(props : DropDownMenuProps){
        super(props)

        this.state = {
            IsOpen : false,
            selected_id : 0,
        }
    }

    ToggleOpen(){
        this.setState({
            IsOpen : !this.state.IsOpen,
        })
    }

    Refresh(){
        this.setState({
            IsOpen : false,
            selected_id : 0, 
        })
    }

    Select(index : number,item : string){

        this.setState({
            IsOpen : false,
            selected_id : index
        })

        this.props.onChange && this.props.onChange({
            index : index,
            value : item,
        })

    }

    render(){
        return ( 
            <div data-open={this.state.IsOpen} className="DropMenu column" >
                <div onClick={e => this.ToggleOpen()} className="DropMenuSelectedValue row DropMenuRow">
                    <div >
                        <span className="DropMenuRowText">
                            {this.props.isLocalize 
                                ? <FormattedMessage id={this.props.items[this.state.selected_id]} /> 
                                : this.props.items[this.state.selected_id]
                            }
                        </span>
                    </div>
                    <svg className="DropMenuArrow" viewBox="0 0 5 9">
                        <path d="M0.419,9.000 L0.003,8.606 L4.164,4.500 L0.003,0.394 L0.419,0.000 L4.997,4.500 L0.419,9.000 Z" />
                    </svg>
                </div>
                <div style={{position: 'relative'}}>
                    <ul className="column">
                        {this.props.items.map((item : string,index : number) => {
                            return (
                                <div onClick={(e) => this.Select(index,item)} key={'index_' + index} className="DropMenuRow row">
                                    <span className="DropMenuRowText">
                                        {this.props.isLocalize 
                                            ? <FormattedMessage id={item} /> 
                                            : item
                                        }
                                    </span>
                                </div>
                            )
                            
                        })}
                    </ul>
                </div>
            </div>
        )
    }

}

export default DropDownMenu