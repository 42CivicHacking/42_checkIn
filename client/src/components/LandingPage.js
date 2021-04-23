import '../styles/LandingPage.css';

// cookie에  w_auth 있는지 확인
// 없으면 로그인 버튼 뜨게
// 있으면 /user/auth => valid check  => 401 : 다시 로그인버튼 / /submit으로

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
