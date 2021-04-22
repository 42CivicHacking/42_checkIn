import '../styles/CheckInPage.css'

function CheckInPage () {
	return (
		<div id="checkin">
			<h1>CheckIn</h1>
			<div>Intra ID: {}</div>
			<div className="input-wrapper"> 본인이 방문한 곳은? <br/>
				<input type="radio" name="place" value="gaepo"/>개포
				<input type="radio" name="place" value="seocho"/>서초
			</div>
			<div className="input-wrapper"> 입실입니까 퇴실입니까? <br/>
			<input type="radio" name="InOut" value="in"/>입실
			<input type="radio" name="InOut" value="out"/>퇴실
			</div>
			<div className="input-wrapper">
				<input type="checkbox" checked="checked"/>발열 체크시 37.5도 이하인 것을 확인했습니다.
				<br/>
				<input type="checkbox" checked="checked"/>이 임시 출입카드를 분실 시 분실 비용이 발생하는 것을 확인했습니다.
				<br/>
				<input type="checkbox" checked="checked"/>마스크를 반드시 상시 착용하고 방역수칙을 준수할 것을 약속하며, 모든 설문을 이상없이 작성했음을 확인합니다.
			</div>
			<div>카드</div>
		</div>
	)
};
export default CheckInPage;
