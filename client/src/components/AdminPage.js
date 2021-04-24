import React, { useState } from "react";
import SearchBar from "./SearchBar";

function AdminPage() {
	const [LogType, setLogType] = useState(0);
	const [Logs, setLogs] = useState([]);

	const handleClusterButton = () => {
		setLogType(0);
	};

	const handleStudentButton = () => {
		setLogType(1);
	};

	const handleCardButton = () => {
		setLogType(2);
	};

	return (
		<div>
			<div>
				<button onClick={handleClusterButton}>클러스터 로그</button>
				<button onClick={handleStudentButton}>학생 로그</button>
				<button onClick={handleCardButton}>카드 로그</button>
				<div>
					<SearchBar type={LogType} setLogs={setLogs} />
				</div>
			</div>
			<div>{Logs.map((log, index) => console.log(log))}</div>
		</div>
	);
}

export default AdminPage;
