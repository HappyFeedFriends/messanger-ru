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

class App extends React.Component {

  render() {
    return (
      <BrowserRouter>
        <div className="App">
          <Switch>
            <Route exact path="/" component={MainPage} />
            <Route exact path='/messages' component={MessagesRouter} />
            <Route path="*" component={Error_404}/>
          </Switch>
        </div>
      </BrowserRouter>
    );
  }
}

export default App;
