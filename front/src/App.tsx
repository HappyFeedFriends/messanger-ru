import React from 'react';
import './styles/App.css';
import './styles/variables.css';
import {
  Switch,
  Route,
  BrowserRouter,
} from "react-router-dom";
import MainPage from './routes';
import Error_404 from './routes/404';
import MessagesRouter from './routes/messages';
import signIn from './routes/signin';

class App extends React.Component {

  render() {
    return (
      <BrowserRouter>
        <div className="App">
          <Switch>
            <Route exact path="/" component={MainPage} />
            <Route exact path='/channel/:ChannelID?' component={MessagesRouter} />
            <Route exact path='/signin' component={signIn} />
            <Route path="*" component={Error_404}/>
          </Switch>
        </div>
      </BrowserRouter>
    );
  }
}

export default App;
