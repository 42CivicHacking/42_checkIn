import '../styles/LandingPage.css';

function LandingPage () {
	const handleLogin = () => {
		window.location.href = '/api/user/login';
	  };
	return (
		<>
			<div className="btn" onClick={handleLogin}>42 Log In</div>
		</>
	)

};

export default LandingPage;
