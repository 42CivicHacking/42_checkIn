import React, { useState } from "react";
import SearchBar from "./SearchBar";
import * as moment from "moment";

function AdminPage() {
	const [LogType, setLogType] = useState(0);
	const [Logs, setLogs] = useState([]);

	const handleClusterButton = () => {
		setLogs([]);
		setLogType(0);
	};

	const handleStudentButton = () => {
		setLogs([]);
		setLogType(1);
	};

	const handleCardButton = () => {
		setLogs([]);
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
			<div>
				<div style={{ display: "flex", flexDirection: "row" }}>
					<div style={{ margin: "10px", width: "10rem" }}>시간</div>
					<div style={{ margin: "10px", width: "7rem" }}>출/입</div>
					<div style={{ margin: "10px", width: "7rem" }}>로그인</div>
					<div style={{ margin: "10px", width: "5rem" }}>
						카드 번호
					</div>
					<div style={{ margin: "10px", width: "5rem" }}>
						개포/서초
					</div>
				</div>
				<hr />
				{Logs &&
					Logs.map((log, index) => {
						const date = new Date(log.createdAt);
						return (
							<div
								key={index}
								style={{
									display: "flex",
									flexDirection: "row",
								}}
							>
								<div style={{ margin: "10px", width: "10rem" }}>
									{moment(date).format("MM월 DD일 HH:mm")}
								</div>
								<div style={{ margin: "10px", width: "7rem" }}>
									{log.type}
								</div>
								<div style={{ margin: "10px", width: "7rem" }}>
									{log.user.userName}
								</div>
								<div style={{ margin: "10px", width: "5rem" }}>
									{log.card.cardId}
								</div>
								<div style={{ margin: "10px", width: "5rem" }}>
									{log.card.type === 0 ? "개포" : "서초"}
								</div>
							</div>
						);
					})}
			</div>
		</div>
	);
}

export default AdminPage;
