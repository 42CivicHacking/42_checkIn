import React, { useEffect, useRef, useState } from "react";
import SearchBar from "./SearchBar";
import * as moment from "moment";
import axios from "axios";
import "../styles/AdminPage.css";

function AdminPage() {
	const [LogType, setLogType] = useState(0);
	const [Logs, setLogs] = useState([]);
	const ref = useRef();

	// useEffect(async () => {
	// 	try {
	// 		const response = await axios.get(`/api/user/status`);
	// 		if (!(response.data && response.data.isAdmin))
	// 			window.location.href = "/submit";
	// 	} catch (err) {
	// 		console.log(err);
	// 		window.location.href = "/";
	// 	}
	// }, []);

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
				`/api/user/forceCheckOut/${userId}`
			);
			setLogs([]);
			ref.current.onSubmit(e);
		} catch (err) {
			console.log(err);
		}
	};

	return (
		<div
			style={{
				justifyContent: "center",
				alignItems: "center",
				display: "flex",
				flexDirection: "column",
			}}
		>
			<div className="selectorRapper">
				<div
					style={{
						display: "flex",
						width: "50%",
						justifyContent: "center",
					}}
				>
					<button
						onClick={handleClusterButton}
						style={{
							width: "20%",
							height: "3rem",
							backgroundColor: "whitesmoke",
							borderRadius: "0.5rem",
							border: "1px solid white",
							margin: "1rem",
						}}
					>
						클러스터 로그
					</button>
					<button
						onClick={handleStudentButton}
						style={{
							width: "20%",
							height: "3rem",
							backgroundColor: "whitesmoke",
							borderRadius: "0.5rem",
							border: "1px solid white",
							margin: "1rem",
						}}
					>
						학생 로그
					</button>
					<button
						onClick={handleCardButton}
						style={{
							width: "20%",
							height: "3rem",
							backgroundColor: "whitesmoke",
							borderRadius: "0.5rem",
							border: "1px solid white",
							margin: "1rem",
						}}
					>
						카드 로그
					</button>
				</div>
				<div
					style={{
						display: "flex",
						border: "1px solid whitesmoke",
						width: "50%",
						padding: "1rem",
						height: "5rem",
					}}
				>
					<SearchBar type={LogType} setLogs={setLogs} ref={ref} />
				</div>
			</div>
			<div>
				<div className="logRapper">
					<div className="logBox3">시간</div>
					<div className="logBox2">출/입</div>
					<div className="logBox2">로그인</div>
					<div className="logBox1">카드 번호</div>
					<div className="logBox1">개포/서초</div>
					<div className="logBox3">강제 퇴실 처리</div>
				</div>
				<hr />
				{Logs &&
					Logs.map((log, index) => {
						const date = new Date(log.createdAt);
						return (
							<div key={index} className="logRapper">
								<div className="logBox3">
									{moment(date).format("MM월 DD일 HH:mm")}
								</div>
								<div className="logBox2">{log.type}</div>
								<div className="logBox2">
									{log.user.userName}
								</div>
								<div className="logBox1">{log.card.cardId}</div>
								<div className="logBox1">
									{log.card.type === 0 ? "개포" : "서초"}
								</div>
								<div
									className="logBox3"
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
