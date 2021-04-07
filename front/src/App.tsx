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

class App extends React.Component {

  render() {
    return (
      <BrowserRouter>
        <div className="App">
          <Switch>
            <Route exact path="/" component={MainPage} />
            <Route path='/channel/:ChannelID?' component={MessagesRouter} />
            <Route path='/signin' component={signIn} />
            <Route path='/signup' component={signUp} />
            <Route path="*" component={Error_404}/>
          </Switch>
        </div>
      </BrowserRouter>
    );
  }
}

export default App;
