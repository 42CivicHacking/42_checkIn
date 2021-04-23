import {useState, useEffect} from 'react';
import axios from 'axios';
import Checkbox from './Checkbox';
import '../styles/SubmitPage.css'

const SERVER_URL = 'http://13.209.202.141';

// card valid check -> server에

function CheckInPage (props) {
	const checkLists = [
		'발열 체크시 37.5도 이하인 것을 확인했습니다.',
		'이 임시 출입카드를 분실 시 분실 비용이 발생하는 것을 확인했습니다.',
		'마스크를 반드시 상시 착용하고 방역수칙을 준수할 것을 약속하며, 모든 설문을 이상없이 작성했음을 확인합니다.'
	];

	const [userId, setUserId] = useState('');
	// const [cardList, setCardList] = useState([]);
	const [isEnter, setIsEnter] = useState(false);
	const [checkAll, setCheckAll] = useState(false);
	const [checkStatus, setCheckStatus] = useState([false, false, false]);
	const [cardNum, setCardNum] = useState('');
	const [readySubmit, setReadySubmit] = useState(false);

	// const fetchCardData = async () => {
	// 	try {
	// 		const response = await axios.get(`${SERVER_URL}/api/card/all`);
	// 		setCardList(response.data);
	// 	} catch (err){
	// 		console.log(err);
	// 	}
	// }

	const fetchUserData = async () => {
		console.log('fetch user data');
		setIsEnter(false);
		// try {
		// 	const response = await axios.get();
		// 	if (response.isEnter === false)
		// 	{
		// 		setIsEnter(true);
		// 		fetchCardData();
		// 	}
		// 	else
		// 		setIsEnter(false);
		// } catch(err) {
		// 	console.log(err);
		// }
	}

	// api/card/valid/{cardid} -> valid check // using: false (사용할 수 있으면), true
	// card invalid -> 메세지 추가, input 초기화

	const handleCheckIn = async () => {
		if (readySubmit)
		{
			console.log("checkin");
			try {
				const response = await axios.post(`${SERVER_URL}/api/user/checkIn/${cardNum}`);
				// {
					// userId: userId,
					// isEnter: isEnter,
					// checkStatus: checkStatus,
				// 	cardNum: cardNum
				// });
				//완료 메세지 추가
				console.log(response);
			} catch (err) {
				console.log(err);
			}
		}
	};

	const handleCheckOut = async() => {
		if (readySubmit)
		{
			console.log("checkout");
			try {
				const response = await axios.post(`${SERVER_URL}/api/user/checkOut`);
				//완료 메세지 추가

				console.log(response);
			} catch (err) {
				console.log(err);
			}
		}
	};

	const handleCheckAll = (e) => {
		const isChecked = e.target.checked;
		setCheckAll(isChecked);
		setCheckStatus([isChecked, isChecked, isChecked]);
	};

	const handlePickCard = (e) => {
		setCardNum(e.target.value);
	}

	useEffect (() => {
		console.log('effect');
		if (userId === '')
			setUserId(window.location.href.split('/').reverse()[0]);
		// 	fetchUserData();
		if (isEnter === false && cardNum !== '' && JSON.stringify(checkStatus) === JSON.stringify([true, true, true]))
			setReadySubmit(true);
		if (cardNum === '' || cardNum === '---' || JSON.stringify(checkStatus) !== JSON.stringify([true, true, true]))
			setReadySubmit(false);
	}, [userId, cardNum, checkStatus, isEnter, readySubmit]);

	return (
		<>
		<div id="checkinout">
			<h1 id="title">{isEnter ? '42 CheckOut' : '42 CheckIn'}</h1>
			<h3 id="userId">Intra ID: {userId}</h3>
			{isEnter ?
				<div className="submitBtn ready" onClick={handleCheckOut}>Check Out</div>
				:
				<div>
					<div className="input-wrapper">
						{/* <h3>Check List</h3> */}
						<input type="checkbox" checked={checkAll} onChange={handleCheckAll} />모두 동의
						<div className="checkbox-wrapper">
							{checkLists.map((checkList, id) =>
							<Checkbox key={id} name={id} text={checkList} checkStatus={checkStatus} setCheckStatus={setCheckStatus}/>)}
						</div>
					</div>
					<div className="input-wrapper">
						<h3>Card Number</h3>
						<input id="card" type="text" name="text" value={cardNum} onChange={handlePickCard}></input>
						{/* <select onChange={handlePickCard}>
							<option>---</option>
							{cardList.map((num) => <option key={num} value={num}>{num}</option>)}
						</select> */}
					</div>
					<div className={`submitBtn ${readySubmit ? ' ready': ''}`} onClick={handleCheckIn}>Check In</div>
				</div>
			}
		</div>
		</>
	)
};
export default CheckInPage;
