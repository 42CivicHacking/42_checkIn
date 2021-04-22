import { BrowserRouter, Route } from 'react-router-dom';
import LandingPage from './LandingPage';
import TempPage from './TempPage';
import './App.css';

function App() {

  return (
    <BrowserRouter>
      <Route path="/" exact={true} component={LandingPage} />
      <Route path="/api/user/login" exact={true} component={TempPage} />
    </BrowserRouter>
  );
}

export default App;
