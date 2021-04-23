import { useEffect } from "react";

function EndPage() {
	useEffect(()=> {
		setTimeout(()=>window.location.href='/submit', 3000);
	})
	return (
		<div>
			<h1 style={{textAlign: "center", marginTop: '45vh'}}>Complete!</h1>
		</div>
	)
}

export default EndPage;
