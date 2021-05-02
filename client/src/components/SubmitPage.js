import { useState, useEffect } from "react";
import axios from "axios";
import Checkbox from "../components/Checkbox";
import "../styles/SubmitPage.css";

function CheckInPage() {
	const checkLists = [
		" 발열 체크시 37.5도 이하인 것을 확인했습니다.",
		" 이 임시 출입카드를 분실 시 분실 비용이 발생하는 것을 확인했습니다.",
		" 마스크를 반드시 상시 착용하고 방역수칙을 준수할 것을 약속하며, 모든 설문을 이상없이 작성했음을 확인합니다.",
	];

	const [userId, setUserId] = useState("");
	const [isEnter, setIsEnter] = useState(false);
	const [checkAll, setCheckAll] = useState(false);
	const [checkStatus, setCheckStatus] = useState([false, false, false]);
	const [cardNum, setCardNum] = useState("");
	const [readySubmit, setReadySubmit] = useState(false);
	const [Gaepo, setGaepo] = useState(0);
	const [Seocho, setSeocho] = useState(0);

	const handleCheckIn = async () => {
		if (readySubmit) {
			try {
				const res_valid = await axios.get(`/api/card/valid/${cardNum}`);
				if (res_valid.data["using"] === false) {
					try {
						await axios.post(`/api/user/checkIn/${cardNum}`);
						window.location.href = "/end";
					} catch (err) {
						console.log(err);
					}
				} else {
					setCardNum("");
					alert("이미 사용 중이거나 유효한 카드 번호가 아닙니다");
				}
			} catch (err) {
				alert(
					"체크인을 처리할 수 없습니다. 제한 인원 초과가 아닌 경우 관리자에게 문의해주세요."
				);
				console.log(err);
			}
		}
	};

	const handleCheckOut = async () => {
		try {
			await axios.post(`/api/user/checkOut`);
			window.location.href = "/end";
		} catch (err) {
			alert("이미 처리된 작업입니다.");
			window.location.href = "/";
			console.log(err);
		}
	};

	const handleCheckAll = (e) => {
		const isChecked = e.target.checked;
		setCheckAll(isChecked);
		setCheckStatus([isChecked, isChecked, isChecked]);
	};

	const handleCardNum = (e) => {
		setCardNum(e.target.value);
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

	const getUserData = async () => {
		try {
			const response = await axios.get("/api/user/status");
			const { login, card } = response.data;
			setUserId(login);
			if (card !== null) setIsEnter(true);
			else setIsEnter(false);
			setGaepo(response.data.gaepo);
			setSeocho(response.data.seocho);
		} catch (err) {
			console.log(err);
			document.cookie = "w_auth=; expires=Thu, 01 Jan 1970 00:00:01 GMT;";
			window.location.href = "/";
		}
	};

	useEffect(() => {
		const token = getCookieValue("w_auth");
		if (token !== "") getUserData();
		else window.location.href = "/";
		if (
			isEnter === false &&
			cardNum !== "" &&
			JSON.stringify(checkStatus) === JSON.stringify([true, true, true])
		)
			setReadySubmit(true);
		if (
			cardNum === "" ||
			cardNum === "---" ||
			JSON.stringify(checkStatus) !== JSON.stringify([true, true, true])
		)
			setReadySubmit(false);
	}, [userId, cardNum, checkStatus, isEnter, readySubmit]);

	return (
		<div id="page-wrapper">
			<div id="checkinout">
				<h1 id="title">{isEnter ? "42 CheckOut" : "42 CheckIn"}</h1>
				<h4> 개포 인원 : {Gaepo} / 150 </h4>
				<h4> 서초 인원 : {Seocho} / 150</h4>
				<h3 id="userId">Intra ID: {userId}</h3>
				{isEnter ? (
					<div className="submitBtn ready" onClick={handleCheckOut}>
						Check Out
					</div>
				) : (
					<div>
						<div className="input-wrapper" style={{textAlign: "left"}}>
							<label htmlFor="allCheck" style={{fontSize: "1em"}}>
								<input
									id="allCheck"
									type="checkbox"
									checked={checkAll}
									onChange={handleCheckAll}
								/>
								모두 동의
							</label>
							<div style={{display: "flex", justifyContent: "center"}}>
							<div className="checkbox-wrapper">
								{checkLists.map((checkList, id) => (
									<Checkbox
										key={id}
										name={id}
										text={checkList}
										checkStatus={checkStatus}
										setCheckStatus={setCheckStatus}
									/>
								))}
							</div>
							</div>
						</div>
						<div className="input-wrapper">
							<h3>Card Number</h3>
							<div id="card">
								<input
									type="number"
									name="text"
									value={cardNum}
									onChange={handleCardNum}
									placeholder="카드 번호를 입력해주세요"
									style={{textAlign: "center"}}
								></input>
							</div>
						</div>
						<button
							className={`submitBtn ${
								readySubmit ? " ready" : ""
							}`}
							onClick={handleCheckIn}
						>
							Check In
						</button>
					</div>
				)}
			</div>
		</div>
	);
}
export default CheckInPage;
