import { BrowserRouter, Route } from 'react-router-dom';
import LandingPage from './components/LandingPage';
import SubmitPage from './components/SubmitPage';
import EndPage from './components/EndPage';
import './App.css';

function App() {
  return (
    <BrowserRouter>
      <Route path="/" exact={true} component={LandingPage} />
      <Route path="/submit" component={SubmitPage}/>
      <Route path="/end" component={EndPage}/>
    </BrowserRouter>
  );
}

export default App;
