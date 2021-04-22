import {useState, useEffect} from 'react';
import axios from 'axios';
import Checkbox from '../components/Checkbox';
import '../styles/CheckInPage.css'

const SERVER_URL = 'http://13.209.202.141';

function CheckInPage () {
	const userId = "juhlee";
	const checkLists = [
		'발열 체크시 37.5도 이하인 것을 확인했습니다.',
		'이 임시 출입카드를 분실 시 분실 비용이 발생하는 것을 확인했습니다.',
		'마스크를 반드시 상시 착용하고 방역수칙을 준수할 것을 약속하며, 모든 설문을 이상없이 작성했음을 확인합니다.'
	];
	let cardLists = [];

	const [isEnter, setIsEnter] = useState(true);
	const [checkStatus, setCheckStatus] = useState({
		0: true,
		1: true,
		2: true
	})
	const [cardNum, setCardNum] = useState(0);

	const fetchData = async () => {
		try {
			const response = await axios.get(`${SERVER_URL}/api/card/all`);
			cardLists = response.data;
		} catch (err){
			console.log(err);
		}
	}

	// useEffect (() => {
	// 	fetchData();
	// });

	const handleCheckIn = async () => {
		try {
			const response = await axios.post(`${SERVER_URL}`,
			{
				userId: userId,
				isEnter: isEnter,
				checkStatus: checkStatus,
				cardNum: cardNum
			});
			console.log(response);
		} catch (err) {
			console.log(err);
		}
	  };

	const handleClick = (e) => {
		if (e.target.value === "in")
			setIsEnter(true);
		else
			setIsEnter(false);
	}
	return (
		<div id="bg">
			<div id="checkin">
				<h1 id="title">42 CheckIn</h1>
				<h4>Intra ID: {userId}</h4>
				<div className="input-wrapper">
					<h4>입실입니까 퇴실입니까? </h4>
					<input type="radio" name="InOut" value="in" onClick={handleClick}/>입실
					<input type="radio" name="InOut" value="out" onClick={handleClick}/>퇴실
				</div>
				<div className="input-wrapper">
					<h4>Check List</h4>
					{/* {console.log(checkStatus)} */}
					{checkLists.map((checkList, id) =>
					<Checkbox key={id} text={checkList} checkStatus={checkStatus} setCheckStatus={setCheckStatus}/>)}
				</div>
				<div className="input-wrapper">
					<h4>Card Number</h4>
					<select>
						{cardLists.map((num) => <option value={num}>{num}</option>)}
					</select>
				</div>
				<div className="submitBtn" onClick={handleCheckIn}>Submit</div>
			</div>
		</div>
	)
};
export default CheckInPage;
