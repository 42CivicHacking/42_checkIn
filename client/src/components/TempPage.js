import { useEffect, useState } from "react";
import axios from 'axios';

// const SERVER_URL='http://13.209.202.141';

function TempPage () {
	const [code, setCode] = useState('');
	const getCode = () => {
		setCode(window.location.search.split('=')[1]);
	}
	const getToken = async () => {
		try {
			const response = await axios.post('api/user/login', {
				code: code
			});
			localStorage.setItem('w_auth', response.data.w_auth);
			window.location.href = '';
		} catch (err) {
			console.log(err);
		}
	}
	useEffect(() => {
		getCode();
		getToken();
	});
	return (
		<div>code</div>
	)
};

export default TempPage;
