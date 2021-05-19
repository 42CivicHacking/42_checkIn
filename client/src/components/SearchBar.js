import axios from "axios";
import React, { forwardRef, useImperativeHandle, useState } from "react";
import "../styles/SearchBar.css";
import Paging from "../components/Paging";

const SearchBar = forwardRef((props, ref) => {
	useImperativeHandle(ref, () => ({
		onSubmit,
	}));
	const [ClusterType, setClusterType] = useState(0);
	//   const [Page, setPage] = useState(0);
	const [Login, setLogin] = useState("");
	const [CardId, setCardId] = useState(0);

	const gaepoCard = [
		1, 2, 3, 5, 6, 8, 10, 11, 13, 14, 15, 16, 19, 20, 21, 23, 25, 26, 29,
		34, 35, 36, 37, 38, 40, 41, 42, 43, 44, 45, 46, 47, 50, 51, 52, 53, 54,
		55, 57, 58, 59, 63, 64, 65, 66, 68, 69, 70, 71, 72, 73, 74, 76, 78, 79,
		80, 81, 85, 86, 87, 89, 90, 91, 92, 93, 95, 96, 99, 101, 102, 103, 104,
		106, 108, 110, 111, 112, 113, 115, 116, 117, 118, 122, 123, 124, 125,
		129, 130, 132, 133, 135, 136, 137, 142, 146, 147, 149, 150, 151, 152,
		153, 154, 156, 158, 161, 163, 166, 167, 168, 169, 170, 171, 172, 173,
		176, 179, 184, 185, 186, 189, 191, 198, 199, 201, 204, 205, 206, 207,
		208, 210, 212, 213, 214, 215, 216, 218, 219, 220, 222, 225, 226, 228,
		229, 231, 233, 234, 235, 240, 242, 243,
	];
	const seochoCard = [
		1000, 1001, 1003, 1004, 1006, 1007, 1008, 1009, 1010, 1012, 1013, 1014,
		1016, 1018, 1019, 1020, 1021, 1022, 1023, 1099, 1101, 1103, 1104, 1106,
		1109, 1110, 1111, 1112, 1113, 1115, 1116, 1117, 1118, 1119, 1120, 1122,
		1123, 1124, 1125, 1126, 1127, 1128, 1129, 1130, 1131, 1132, 1133, 1134,
		1135, 1136, 1137, 1139, 1140, 1141, 1142, 1143, 1144, 1145, 1148, 1149,
		1150, 1151, 1152, 1153, 1154, 1155, 1156, 1157, 1158, 1159, 1160, 1161,
		1162, 1163, 1164, 1165, 1166, 1168, 1169, 1170, 1171, 1172, 1173, 1174,
		1176, 1177, 1178, 1179, 1180, 1181, 1182, 1183, 1184, 1185, 1186, 1187,
		1188, 1189, 1190, 1191, 1192, 1193, 1194, 1195, 1197, 1198, 1199, 1200,
		1201, 1202, 1203, 1204, 1205, 1206, 1207, 1208, 1209, 1210, 1211, 1212,
		1214, 1217, 1218, 1219, 1220, 1221, 1222, 1223, 1225, 1226, 1228, 1229,
		1230, 1231, 1232, 1237, 1238, 1239, 1240, 1242, 1245, 1246, 1248, 1250,
		1251, 1252, 1253, 1254, 1255, 1256,
	];

	const handleClick = (e) => {
		props.setLogs([]);
		setClusterType(e.target.value);
		props.setPage(0);
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
						}?page=${props.Page}`
					);
					break;
				case 1:
					response = await axios.get(
						`/api/log/user/${Login}?page=${props.Page}`
					);
					break;
				case 2:
					response = await axios.get(
						`/api/log/card/${CardId}?page=${props.Page}`
					);
					break;
				case 3:
					response = await axios.get(
						`/api/log/checkIn/${ClusterType}`
					);
					break;
				case 4:
					response = await axios.get(
						`/api/log/allCard/${ClusterType}`
					);
					break;
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
			if (props.type === 4) {
				let newdata = [];
				const card = ClusterType == 0 ? gaepoCard : seochoCard;
				card.map((item, index) => {
					const tmp = data.find((ele) => {
						if (ele.card.cardId === item) return true;
					});
					newdata.push({ id: item, ...tmp });
				});
				data = newdata;
			}
			props.setLogs(data);
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
				<Paging Page={props.Page} setPage={props.setPage} />
			</form>
		</div>
	);

	const Student = () => (
		<div className="control-section">
			<form onSubmit={onSubmit}>
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
				<Paging Page={props.Page} setPage={props.setPage} />
			</form>
		</div>
	);

	const Card = () => (
		<div className="control-section">
			<form onSubmit={onSubmit}>
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
				<Paging Page={props.Page} setPage={props.setPage} />
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
