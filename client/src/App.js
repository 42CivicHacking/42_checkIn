import { BrowserRouter, Route } from 'react-router-dom';
import LandingPage from './components/LandingPage';
import TempPage from './components/TempPage';
// import './App.css';
import CheckInPage from './components/CheckInPage';

function App() {
  return (
    <BrowserRouter>
      <Route path="/" exact={true} component={LandingPage} />
      <Route path="/temp" component={TempPage} />
      <Route path="/checkin" component={CheckInPage}/>
    </BrowserRouter>
  );
}

export default App;
