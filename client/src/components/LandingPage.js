import { useEffect } from "react";
import "../styles/LandingPage.css";

function LandingPage() {
	useEffect(() => {
		const token = getCookieValue("w_auth");
		if (token !== "") window.location.href = "/submit";
	}, []);

	const handleLogin = () => {
		window.location.href = "/api/user/login";
	};
	const getCookieValue = (key) => {
		let cookieKey = key + "=";
		let result = "";
		const cookieArr = document.cookie.split(";");

		for (let i = 0; i < cookieArr.length; i++) {
			if (cookieArr[i][0] === " ")
				cookieArr[i] = cookieArr[i].substring(1);
			if (cookieArr[i].indexOf(cookieKey) === 0) {
				result = cookieArr[i].slice(
					cookieKey.length,
					cookieArr[i].length
				);
				return result;
			}
		}
		return result;
	};
	return (
		<>
			<div className="btn" onClick={handleLogin}>
				42 Log In
			</div>
		</>
	);
}

export default LandingPage;
