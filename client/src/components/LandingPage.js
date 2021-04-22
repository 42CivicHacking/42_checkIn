import '../styles/LandingPage.css';

const CLIENT_ID = 'f312ff6c8d982b88860a72019668c3d2b6e59b66c6c0e43a783d373519fedc54';
const REDIRECT_URI = 'https%3A%2F%2Fcluster.42seoul.kr%2Fchecin%2Fapi%2Fuser%2Flogin';
const API_URL = 'https://api.intra.42.fr/oauth/authorize';

function LandingPage () {
	const handleCheckIn = () => {
		window.location.href = `${API_URL}?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&response_type=code`;
		// window.location.href = 'https://api.intra.42.fr/oauth/authorize?client_id=f312ff6c8d982b88860a72019668c3d2b6e59b66c6c0e43a783d373519fedc54&redirect_uri=https%3A%2F%2Fcluster.42seoul.kr%2Fchecin%2Fapi%2Fuser%2Flogin&response_type=code';
	  };
	return (
		<div className="btn-wrapper">
		<div className="btn" onClick={handleCheckIn}>42 CheckIn</div>
		</div>
	)
};

export default LandingPage;
