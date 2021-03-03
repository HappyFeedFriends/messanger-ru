import React from 'react';
import './styles/App.css';
import {
  Switch,
  Route,
} from "react-router-dom";
import MainPage from './routes';
import Error_404 from './routes/404';


function App() {
  return (
    <div className="App">
        <Switch>
          <Route exact path="/" component={MainPage} />
          <Route path='/messages' component={Error_404} />
          <Route path="*" component={Error_404}/>
        </Switch>
    </div>
  );
}

export default App;
