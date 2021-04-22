import '../styles/LandingPage.css';

const CLIENT_ID = 'f312ff6c8d982b88860a72019668c3d2b6e59b66c6c0e43a783d373519fedc54';
const REDIRECT_URI = 'http%3A%2F%2F13.209.202.141%2Fapi%2Fuser%2Flogin';
const API_URL = 'https://api.intra.42.fr/oauth/authorize';

function LandingPage () {
	const handleLogin = () => {
		window.location.href = `${API_URL}?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&response_type=code`;
	  };
	return (
		<div className="btn-wrapper">
		<div className="btn" onClick={handleLogin}>42 CheckIn</div>
		</div>
	)
};

export default LandingPage;
