import { useEffect } from "react";
import '../styles/EndPage.css';

function EndPage() {
	useEffect(()=> {
		setTimeout(()=>window.location.href='/submit', 3000);
	})
	return (
		<>
			<h1>Complete!</h1>
		</>
	)
}

export default EndPage;
