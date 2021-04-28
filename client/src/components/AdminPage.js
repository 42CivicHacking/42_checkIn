import React, { useEffect, useRef, useState } from "react";
import SearchBar from "./SearchBar";
import * as moment from "moment";
import axios from "axios";

const SERVER_URL = "http://13.209.202.141";

function AdminPage() {
	const [LogType, setLogType] = useState(0);
	const [Logs, setLogs] = useState([]);
	const ref = useRef();

	useEffect(async () => {
		try {
			const response = await axios.get(`/api/user/status`);
			console.log(response.data);
			if (!(response.data && response.data.isAdmin))
				window.location.href = "/submit";
		} catch (err) {
			console.log(err);
			window.location.href = "/";
		}
	}, []);

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

	const checkOutOnClick = async (e) => {
		try {
			const userId = e.target.getAttribute("data");
			const response = await axios.post(
				`${SERVER_URL}/api/user/forceCheckOut/${userId}`
			);
			setLogs([]);
			ref.current.onSubmit(e);
		} catch (err) {
			console.log(err);
		}
	};

	return (
		<div>
			<div>
				<button onClick={handleClusterButton}>클러스터 로그</button>
				<button onClick={handleStudentButton}>학생 로그</button>
				<button onClick={handleCardButton}>카드 로그</button>
				<div>
					<SearchBar type={LogType} setLogs={setLogs} ref={ref} />
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
								<div
									style={{
										margin: "10px",
										width: "10rem",
									}}
									data={log.user.userId}
									onClick={checkOutOnClick}
								>
									{log.card.cardId === log.user.cardId
										? "퇴실처리하기"
										: null}
								</div>
							</div>
						);
					})}
			</div>
		</div>
	);
}

export default AdminPage;
