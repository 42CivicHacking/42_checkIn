import axios from 'axios';
import { useEffect } from 'react';
import '../styles/LandingPage.css';

// cookie에  w_auth 있는지 확인
// 없으면 로그인 버튼 뜨게
// 있으면 /user/auth => valid check  => 401 : 다시 로그인버튼 / /submit으로
function LandingPage () {
	const getCookieValue = (key) => {
		let cookieKey = key + "=";
		let result = "";
		const temp = "_ga=GA1.2.325595084.1553693343; tz=Asia%2FSeoul; w_auth=123; _octo=GH1.1.1561395261.1616810774";
		// const cookieArr = document.cookie.split(";");
		const cookieArr = temp.split(';');

		for(let i = 0; i < cookieArr.length; i++) {
		  if(cookieArr[i][0] === " ")
			cookieArr[i] = cookieArr[i].substring(1);
		  if(cookieArr[i].indexOf(cookieKey) === 0) {
			result = cookieArr[i].slice(cookieKey.length, cookieArr[i].length);
			return result;
		  }
		}
		return result;
	}

	const getUserData = async() => {
		try {
			const response = await axios.get('/api/user/status');
			// console.log('user status: {card info}', response.data);
			const userId = response.data['userId'];
			const cardNum = response.data['card'];
			// const userId='juhlee';
			window.location.href = `/submit/${userId}`;
		} catch (err) {
			console.log(err);
			document.cookie = 'w_auth=; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
		}
	}

	useEffect(() => {
		const token = getCookieValue('w_auth');
		console.log('token: ',token);
		if (token !== '')
			getUserData();
	})

	const handleLogin = () => {
		window.location.href = '/api/user/login';
	  };
	return (
		<div className="btn-wrapper">
		<div className="btn" onClick={handleLogin}>42 CheckIn</div>
		</div>
	)

};

export default LandingPage;
