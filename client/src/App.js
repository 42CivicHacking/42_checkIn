import { BrowserRouter, Route, Switch } from "react-router-dom";
import LandingPage from "./components/LandingPage";
import SubmitPage from "./components/SubmitPage";
import EndPage from "./components/EndPage";
import AdminPage from "./components/AdminPage";
import NotFoundPage from "./pages/NotFoundPage";
import "./App.css";
import Test from "./components/Test";

function App() {
	return (
		<BrowserRouter>
			<Switch>
				<Route path="/" exact={true} component={LandingPage} />
				<Route path="/submit" component={SubmitPage} />
				<Route path="/end" component={EndPage} />
				<Route path="/admin" component={AdminPage} />
				{/* <Route path="/test" component={Test} /> */}
				<Route component={NotFoundPage} />
			</Switch>
		</BrowserRouter>
	);
}

export default App;
