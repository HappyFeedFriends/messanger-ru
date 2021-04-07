import React from 'react';
import '../styles/Preloader.scss';
import gif from '../images/preloader.gif'

interface PreloadProp{
    transitionHidden : boolean,
}

class Preloader extends React.Component<PreloadProp>{

    GetRandomTip(){

        const arr = [
            'А вы знали, что акулы очень добрые существа?',
            'Если вы голодны - поешьте.',
            'Если хочешь спать - поспи.',
            'Влюблённая акула уже не хищник.',
            'Не наводите суету.',
            'ОООООО Повезло - Повезло.',
        ]   

        return arr.sort((a,b) => Math.random() - 0.5)[0] 
    }

    render(){
        return ( 
            <div  className={"PreloadContainer column" + (this.props.transitionHidden ? ' hidden' : "")} >
                <img src={gif} alt="" className="Shark"/>
                <span>{this.GetRandomTip()}</span>
            </div>
        );  
    }
}

export default Preloader;