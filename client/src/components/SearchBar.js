import axios from "axios";
import React, { forwardRef, useImperativeHandle, useState } from "react";
import "../styles/SearchBar.css";

const SearchBar = forwardRef((props, ref) => {
	useImperativeHandle(ref, () => ({
		onSubmit,
	}));
	const [ClusterType, setClusterType] = useState(0);
	const [Page, setPage] = useState(0);
	const [Login, setLogin] = useState("");
	const [CardId, setCardId] = useState(0);

	const gaepoCard = [
		1,
		2,
		5,
		6,
		8,
		10,
		11,
		13,
		14,
		15,
		16,
		19,
		20,
		21,
		23,
		25,
		26,
		29,
		34,
		35,
		36,
		37,
		38,
		40,
		41,
		42,
		43,
		44,
		45,
		47,
		50,
		51,
		52,
		53,
		54,
		55,
		57,
		58,
		59,
		63,
		64,
		65,
		66,
		68,
		69,
		70,
		71,
		72,
		73,
		74,
		76,
		78,
		79,
		80,
		81,
		85,
		86,
		87,
		89,
		90,
		91,
		92,
		93,
		95,
		96,
		99,
		101,
		102,
		103,
		104,
		106,
		108,
		110,
		111,
		112,
		113,
		115,
		116,
		117,
		118,
		122,
		123,
		124,
		125,
		129,
		130,
		132,
		133,
		135,
		136,
		137,
		142,
		146,
		147,
		149,
		150,
		151,
		152,
		153,
		154,
		156,
		158,
		161,
		163,
		166,
		167,
		168,
		169,
		170,
		171,
		172,
		173,
		176,
		179,
		184,
		185,
		186,
		189,
		191,
		198,
		199,
		201,
		203,
		204,
		205,
		206,
		207,
		208,
		210,
		212,
		213,
		214,
		215,
		216,
		218,
		219,
		220,
		222,
		225,
		226,
		228,
		229,
		231,
		233,
		234,
		235,
		240,
		242,
		243,
		245,
	];

	const handleClick = (e) => {
		props.setLogs([]);
		setClusterType(e.target.value);
		setPage(0);
	};

	const onSubmit = async (e) => {
		e.preventDefault();
		try {
			let response;
			switch (props.type) {
				case 0:
					response = await axios.get(
						`/api/log/${
							ClusterType === 0 ? "gaepo" : "seocho"
						}/${Page}`
					);
					break;
				case 1:
					response = await axios.get(`/api/log/user/${Login}`);
					break;
				case 2:
					response = await axios.get(`/api/log/card/${CardId}`);
					break;
				case 3:
					response = await axios.get(
						`/api/log/checkIn/${ClusterType}`
					);
				case 4:
					response = await axios.get(
						`/api/log/allCard/${ClusterType}`
					);
				default:
					break;
			}
			let data;
			data = response.data;
			if (props.type === 3 || props.type === 4) {
				data = response.data
					.filter((item, index) => {
						return (
							response.data.findIndex((item2, i) => {
								return item.user._id === item2.user._id;
							}) === index
						);
					})
					.reverse();
			}
			if (props.type === 4 && ClusterType == 0) {
				let newdata = [];
				gaepoCard.map((item, index) => {
					const tmp = data.find((ele) => {
						if (ele.card.cardId === item) return true;
					});
					newdata.push({ id: item, ...tmp });
				});
				data = newdata;
			}
			props.setLogs(data);
			console.log(data);
		} catch (err) {
			console.log(err);
		}
	};

	const Cluster = () => (
		<div className="control-section">
			<form onSubmit={onSubmit}>
				<div>
					<label>
						<input
							type="radio"
							name="cluster"
							value={0}
							checked={ClusterType == 0}
							onChange={handleClick}
						/>
						개포
					</label>
					<label>
						<input
							type="radio"
							name="cluster"
							value={1}
							checked={ClusterType == 1}
							onChange={handleClick}
						/>
						서초
					</label>
					<button onClick={onSubmit}>불러오기</button>
				</div>
				{/* <div>
					<label>{Page}</label>
					<button
						onClick={() => {
							setPage(Page === 0 ? 0 : Page - 1);
						}}
					>
						이전 페이지
					</button>
					<button
						onClick={() => {
							setPage(Page + 1);
						}}
					>
						다음 페이지
					</button>
				</div> */}
			</form>
		</div>
	);

	const Student = () => (
		<div className="control-section">
			<form>
				<input
					type="text"
					name="로그인"
					value={Login}
					placeholder="인트라 아이디"
					onChange={(e) => {
						setLogin(e.target.value);
					}}
					style={{
						textAlign: "center",
					}}
				/>
				<button onClick={onSubmit}>불러오기</button>
			</form>
		</div>
	);

	const Card = () => (
		<div className="control-section">
			<form>
				<input
					type="text"
					name="text"
					value={CardId}
					placeholder="카드번호"
					onChange={(e) => {
						setCardId(e.target.value);
					}}
					style={{
						textAlign: "center",
					}}
				/>
				<button onClick={onSubmit}>불러오기</button>
			</form>
		</div>
	);

	switch (props.type) {
		case 0:
			return Cluster();
		case 1:
			return Student();
		case 2:
			return Card();
		case 3:
			return Cluster();
		default:
			return Cluster();
	}
});

export default SearchBar;
