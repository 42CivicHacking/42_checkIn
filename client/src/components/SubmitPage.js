import { useState, useEffect } from "react";
import axios from "axios";
import Checkbox from "../components/Checkbox";
import UserInput from "../components/UserInput";
import Button from "../components/Button";
import Timer from "./Timer";
import Modal from "./Modal";
import { getCookieValue } from "../utils/utils";
import { checkLists, waitingNoti } from "../utils/notice";
import "../styles/SubmitPage.css";

function CheckInPage() {
	const [userInfo, setUserInfo] = useState({
		userId: "",
		cardNum: "",
		waitingNum: null,
		status: "out",
		timeOut: null,
	});

	const [clusterInfo, setClusterInfo] = useState({
		gaepo: 0,
		g_waiting: 0,
		seocho: 0,
		s_waiting: 0,
	});

	const [checkAll, setCheckAll] = useState(false);
	const [checkStatus, setCheckStatus] = useState([false, false, false]);
	const [readySubmit, setReadySubmit] = useState(false);

	// const [waitingCheckStatus, setWaitingCheckStatus] = useState(false);
	// const [waitingCluster, setWaitingCluster] = useState(null);
	// const [readyWait, setReadyWait] = useState(false);

	// const [waitStatus, setWaitStatus] = useState('cannot'); // waiting status: cannot, ready, waiting

	const { userId, cardNum, waitingNum, status, timeOut } = userInfo;
	const { gaepo, g_waiting, seocho, s_waiting } = clusterInfo;

	const handleCheckIn = async () => {
		if (readySubmit) {
			try {
				const response = await axios.get(`/api/card/valid/${cardNum}`);
				console.log(response.data);
				if (response.data["using"] === false) {
					try {
						await axios.post(`/api/user/checkIn/${cardNum}`);
						window.location.href = "/end";
					} catch (err) {
						console.log(err);
					}
				} else {
					setUserInfo({
						...userInfo,
						cardNum: "",
					});
					alert("이미 사용 중이거나 유효한 카드 번호가 아닙니다");
				}
			} catch (err) {
				if (err.response.status === 400) {
					const modal = document.getElementById("myModal");
					modal.style.display = "flex";
				} else
					alert(
						"체크인을 처리할 수 없습니다. 제한 인원 초과가 아닌 경우 관리자에게 문의해주세요."
					);
			}
		}
	};

	const handleCheckOut = async () => {
		if (window.confirm("퇴실 하시겠습니까?")) {
			try {
				await axios.post("/api/user/checkOut");
				window.location.href = "/end";
			} catch (err) {
				alert("이미 처리된 작업입니다.");
				window.location.href = "/";
				console.log(err);
			}
		}
	};

	const handleCheckAll = (e) => {
		const isChecked = e.target.checked;
		setCheckAll(isChecked);
		setCheckStatus([isChecked, isChecked, isChecked]);
	};

	// const handleWait = async () => {
	//   if (readyWait) {
	//     try {
	//       await axios.post(`/api/waiting/create/${waitingCluster === 'gaepo' ? 0 : 1}`);
	//       try {
	//         const response = await axios.get('/api/user/status');
	//         const { user, cluster } = response.data;
	//         setUserInfo({
	//           ...userInfo,
	//           waitingNum: user.waitingNum,
	//           timeout: user.timeOut
	//         });
	//         setClusterInfo({
	//           gaepo: cluster.gaepo,
	//           g_waiting: cluster.gaepoWaiting,
	//           seocho: cluster.seocho,
	//           s_waiting: cluster.seochoWaiting
	//         });
	//         setWaitStatus('waiting');
	//       } catch (err) {
	//         console.log(err);
	//       }
	//     } catch (err) {
	//       console.log(err);
	//       if (err.response.status === 400) {
	//         const modal = document.getElementById('myModal');
	//         modal.style.display = 'flex';
	//       } else console.log(err);
	//     }
	//   }
	// };

	useEffect(() => {
		const checkSubmitCondition = () => {
			if (
				cardNum !== "" &&
				JSON.stringify(checkStatus) ===
					JSON.stringify([true, true, true])
			)
				setReadySubmit(true);
			else setReadySubmit(false);
		};

		// const checkWaitCondition = () => {
		//   if (waitingCheckStatus === true) setReadyWait(true);
		//   else setReadyWait(false);
		// };

		const getUserData = async () => {
			try {
				const response = await axios.get("/api/user/status");
				const { user, cluster } = response.data;
				setUserInfo({
					userId: user.login,
					cardNum: user.card,
					status: user.card !== null ? "in" : "out",
					waitingNum: user.waitingNum,
					timeOut: user.timeOut,
				});
				setClusterInfo({
					gaepo: cluster.gaepo,
					g_waiting: cluster.gaepoWaiting,
					seocho: cluster.seocho,
					s_waiting: cluster.seochoWaiting,
				});
				// if (cluster.gaepo === 150 && cluster.seocho !== 150) setWaitingCluster('gaepo');
				// else if (cluster.gaepo !== 150 && cluster.seocho === 150) setWaitingCluster('seocho');
			} catch (err) {
				document.cookie =
					"w_auth=; expires=Thu, 01 Jan 1970 00:00:01 GMT;";
				window.location.href = "/";
			}
		};

		const token = getCookieValue("w_auth");
		if (token !== "") getUserData();
		else window.location.href = "/";

		if (JSON.stringify(checkStatus) !== JSON.stringify([true, true, true]))
			setCheckAll(false);
		else setCheckAll(true);

		if (status === "out") checkSubmitCondition();
		// if (waitStatus === 'ready') checkWaitCondition();
		// }, [cardNum, checkStatus, status, userInfo, waitStatus, waitingCheckStatus]);
	}, [cardNum, checkStatus, status]);

	return (
		<div id="page-wrapper">
			<div id="checkinout">
				<h1 id="title">
					{/* {status === 'in' ? '42 CheckOut' : waitStatus !== 'cannot' ? '42 Waiting' : '42 CheckIn'} */}
					{status === "in" ? "42 CheckOut" : "42 CheckIn"}
				</h1>
				<h4>
					개포 인원 : {gaepo} / 150{" "}
					{gaepo === 150 ? `(${g_waiting})` : ""}
				</h4>
				<h4>
					서초 인원 : {seocho} / 150{" "}
					{seocho === 150 ? `(${s_waiting})` : ""}
				</h4>
				<h3> Intra ID : {userId}</h3>
				{status === "in" ? (
					<>
						<h3>Card Number : {cardNum}</h3>
						<Button
							className="submitBtn ready"
							handleClick={handleCheckOut}
							text="Check Out"
						/>
					</>
				) : (
					<div>
						<div
							className="input-wrapper"
							style={{ textAlign: "left" }}
						>
							<label
								htmlFor="allCheck"
								style={{ fontSize: "1em" }}
							>
								<input
									id="allCheck"
									type="checkbox"
									checked={checkAll}
									onChange={handleCheckAll}
								/>
								모두 동의
							</label>
							<div
								style={{
									display: "flex",
									justifyContent: "center",
								}}
							>
								<div className="checkbox-wrapper">
									{checkLists.map((checkList, idx) => (
										<Checkbox
											key={idx}
											idx={idx}
											text={checkList}
											checkStatus={checkStatus}
											setCheckStatus={setCheckStatus}
										/>
									))}
								</div>
							</div>
						</div>
						<UserInput
							label="Card Number"
							type="number"
							placeholder="카드 번호를 입력해주세요"
							value={cardNum}
							handleChange={(e) => {
								setUserInfo({
									...userInfo,
									cardNum: e.target.value,
								});
							}}
						/>
						<Button
							className={`submitBtn ${
								readySubmit ? " ready" : ""
							}`}
							handleClick={handleCheckIn}
							text="Check In"
						/>
					</div>
				)}
			</div>
			<Modal />
		</div>
	);
}
export default CheckInPage;
