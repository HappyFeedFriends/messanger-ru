import React from 'react';
import './styles/App.scss';
import './styles/variables.scss';
import {
  Switch,
  Route,
  BrowserRouter,
} from "react-router-dom";
import MainPage from './routes';
import Error_404 from './routes/404';
import MessagesRouter from './routes/messages';
import signIn from './routes/signin';
import signUp from './routes/signup';
import {IntlProvider} from 'react-intl'
import lang_ru from './lang/ru.json'
import lang_en from './lang/en.json'
import { connect, ConnectedProps } from 'react-redux';
import { RootState } from './redux/rootReducer';

class App extends React.Component<PropsFromRedux> {

  GetMessages(){
    const locale = this.props.lang
    switch (locale) {
      case 'en':
        return {...lang_ru,...lang_en}
      case 'ru':
        return lang_ru
      default:
        return lang_ru
    }
  }

  render() { 
    return (
      <IntlProvider locale={this.props.lang} defaultLocale="ru" messages={this.GetMessages()}>
      <BrowserRouter>
        <div className="App" data-theme={'dark'}>
          <Switch>
            <Route exact path="/" component={MainPage} />
            <Route path='/channel/:ChannelID?' component={MessagesRouter} />
            <Route path='/signin' component={signIn} />
            <Route path='/signup' component={signUp} />
            <Route path="*" component={Error_404}/>
          </Switch>
        </div>
      </BrowserRouter>
      </IntlProvider>
    );
  }
}

const mapStateToProps = (state : RootState) => {
  return {
      lang : state.APPReducer.lang
  };
}

const connector = connect(mapStateToProps,{})
type PropsFromRedux = ConnectedProps<typeof connector>

export default connector(App)
