import axios from "axios";
import React, { useState } from "react";
import Checkbox from "./Checkbox";

function SearchBar(props) {
	const SERVER_URL = "http://13.209.202.141";

	const [ClusterType, setClusterType] = useState(0);
	const [Page, setPage] = useState(0);
	const [Login, setLogin] = useState("");
	const [CardId, setCardId] = useState(0);

	const handleClick = (e) => {
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
						`${SERVER_URL}/api/log/${
							ClusterType == 0 ? "gaepo" : "seocho"
						}/${Page}`
					);
					break;
				case 1:
					response = await axios.get(
						`${SERVER_URL}/api/log/user/${Login}`
					);
					break;
				case 2:
					response = await axios.get(
						`${SERVER_URL}/api/log/card/${CardId}}`
					);
					break;
				default:
					break;
			}
			props.setLogs(response.data);
		} catch (err) {
			console.log(err);
		}
	};

	const Cluster = () => (
		<div>
			<form onSubmit={onSubmit}>
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
				<label>{Page}</label>
				<button
					onClick={() => {
						setPage(Page == 0 ? 0 : Page - 1);
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
				<button onClick={onSubmit}>불러오기</button>
			</form>
		</div>
	);

	const Student = () => (
		<div>
			<form>
				<input
					type="text"
					name="로그인"
					value={Login}
					onChange={(e) => {
						setLogin(e.target.value);
					}}
				/>
				<button onClick={onSubmit}>불러오기</button>
			</form>
		</div>
	);

	const Card = () => (
		<div>
			<form>
				<input
					type="text"
					name="text"
					value={CardId}
					onChange={(e) => {
						setCardId(e.target.value);
					}}
				></input>
				<button onClick={onSubmit}>불러오기</button>
			</form>
		</div>
	);

	switch (props.type) {
		case 0:
			return Cluster();
			break;
		case 1:
			return Student();
			break;
		case 2:
			return Card();
			break;
		default:
			return Cluster();
			break;
	}
}

export default SearchBar;
