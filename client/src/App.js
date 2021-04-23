import { BrowserRouter, Route } from 'react-router-dom';
import LandingPage from './components/LandingPage';
import SubmitPage from './components/SubmitPage';
import './App.css';

function App() {
  return (
    <BrowserRouter>
      <Route path="/" exact={true} component={LandingPage} />
      <Route path="/submit" component={SubmitPage}/>
    </BrowserRouter>
  );
}

export default App;
