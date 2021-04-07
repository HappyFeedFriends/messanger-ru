import React from 'react';
import '../../styles/modal_window_files.scss';
import TextareaAutosize from 'react-textarea-autosize';
interface FilesComponentProps {
    type : 'img' | 'document'
    result : string
    inputValue : string
    fileName : string
    OnSendMessage : (newMessage : string) => void;
    CloseModal : () => void;
}

interface FilesComponentState{
    inputValue : string 
}

class ModalWindowFiles extends React.Component<FilesComponentProps,FilesComponentState>{

    constructor(props : FilesComponentProps){
        super(props)
        this.state = {
            inputValue : props.inputValue
        }
    }

    onKeyPressed(e : React.KeyboardEvent){
        if (e.key.toLowerCase() === 'enter' && !e.shiftKey){
            e.preventDefault()
            this.props.OnSendMessage(this.state.inputValue);
        }
    }

    onChangeMessage(event : React.ChangeEvent<HTMLTextAreaElement>){
        this.setState({
            inputValue : event.currentTarget.value 
        })
    }


    render(){
        return (
            <div className="ModalWindow_File column">
                <div className="fileHeader row"> 
                    <img className="fileHeader_image" src={this.props.result} alt="image_file" />
                    <div className="fileDescription column">
                        <span className="fileDescription_name" >{this.props.fileName}</span>
                    </div>
                </div>
                <div className="column content">
                    <div className="headerInputTextFile row">
                        <span>Добавить комментарий <span>(Необязательно)</span></span>
                    </div>
                    <div className="InputTextFileContainer row">
                        <TextareaAutosize 
                        value={this.state.inputValue} 
                        onChange={(e) => this.onChangeMessage(e)} 
                        onKeyDown={(e) => this.onKeyPressed(e)} 
                        tabIndex={0} 
                        spellCheck={true} 
                        placeholder="Message" 
                        maxLength={2000} 
                        className="InputText" 
                        wrap="soft"/>
                        <div className="emoji_smile_icon_vector"/>
                    </div>
                </div>
                <div className="footerModalWindowFile row"> 
                    <button onClick={() => this.props.CloseModal()} >Отмена</button>
                    <button onClick={() => this.props.OnSendMessage(this.state.inputValue)}>Отправить</button> 
                </div>
            </div>
        );  
    } 
}

export default ModalWindowFiles;