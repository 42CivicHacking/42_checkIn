import { useState, useEffect } from 'react';
import axios from 'axios';
import Checkbox from '../components/Checkbox';
import UserInput from '../components/UserInput';
import Button from '../components/Button';
import Timer from './Timer';
import Modal from './Modal';
import '../styles/SubmitPage.css';

function CheckInPage() {
  const checkLists = [
    ' 발열 체크시 37.5도 이하인 것을 확인했습니다.',
    ' 이 임시 출입카드를 분실 시 분실 비용이 발생하는 것을 확인했습니다.',
    ' 마스크를 반드시 상시 착용하고 방역수칙을 준수할 것을 약속하며, 모든 설문을 이상없이 작성했음을 확인합니다.'
  ];

  const waitingNoti = [
    ' 입장 안내 알림을 받은 후로 10분 이내에 체크인을 완료하지 않을 시에 대기가 자동 취소됨을 확인합니다.'
  ];

  const [userInfo, setUserInfo] = useState({
    userId: '',
    cardNum: '',
    waitingNum: null,
    status: 'out',
    timeOut: null
  });

  const [clusterInfo, setClusterInfo] = useState({
    gaepo: 150,
    g_waiting: 0,
    seocho: 50,
    s_waiting: 0
  });

  const [checkAll, setCheckAll] = useState(false);
  const [checkStatus, setCheckStatus] = useState([false, false, false]);
  const [readySubmit, setReadySubmit] = useState(false);

  const [waitingCheckStatus, setWaitingCheckStatus] = useState(false);
  const [waitingCluster, setWaitingCluster] = useState(null);
  const [readyWait, setReadyWait] = useState(false);

  const [waitStatus, setWaitStatus] = useState('cannot'); // waiting status: cannot, ready, waiting

  const { userId, cardNum, waitingNum, status, timeOut } = userInfo;
  const { gaepo, g_waiting, seocho, s_waiting } = clusterInfo;

  const handleCheckIn = async () => {
    if (readySubmit) {
      try {
        const response = await axios.get(`/api/card/valid/${cardNum}`);
        if (response.data['using'] === false) {
          try {
            await axios.post(`/api/user/checkIn/${cardNum}`);
            window.location.href = '/end';
          } catch (err) {
            console.log(err);
          }
        } else {
          setUserInfo({
            ...userInfo,
            cardNum: ''
          });
          alert('이미 사용 중이거나 유효한 카드 번호가 아닙니다');
        }
      } catch (err) {
        // if (err.response.status === 400) {
        if (err.response.status === 404) {
          const modal = document.getElementById('myModal');
          modal.style.display = 'flex';
        } else
          alert('체크인을 처리할 수 없습니다. 제한 인원 초과가 아닌 경우 관리자에게 문의해주세요.');
      }
    }
  };

  const handleCheckOut = async () => {
    if (window.confirm('퇴실 하시겠습니까?')) {
      try {
        await axios.post('/api/user/checkOut');
        window.location.href = '/end';
      } catch (err) {
        alert('이미 처리된 작업입니다.');
        window.location.href = '/';
        console.log(err);
      }
    }
  };

  const handleCheckAll = e => {
    const isChecked = e.target.checked;
    setCheckAll(isChecked);
    setCheckStatus([isChecked, isChecked, isChecked]);
  };

  const handleWait = async () => {
    if (readyWait) {
      try {
        await axios.post(`/api/waiting/create/${waitingCluster === 'gaepo' ? 0 : 1}`);
        try {
          const response = await axios.get('/api/user/status');
          const { user, cluster } = response.data;
          setUserInfo({
            ...userInfo,
            waitingNum: user.waitingNum,
            timeout: user.timeOut
          });
          setClusterInfo({
            gaepo: cluster.gaepo,
            g_waiting: cluster.gaepoWaiting,
            seocho: cluster.seocho,
            s_waiting: cluster.seochoWaiting
          });
          setWaitStatus('waiting');
        } catch (err) {
          console.log(err);
        }
      } catch (err) {
        console.log(err);
        // if (err.response.status === 400) {
        if (err.response.status === 404) {
          const modal = document.getElementById('myModal');
          modal.style.display = 'flex';
        } else console.log(err);
      }
    }
  };

  const getCookieValue = key => {
    let cookieKey = key + '=';
    let result = '';
    const cookieArr = document.cookie.split(';');

    for (let i = 0; i < cookieArr.length; i++) {
      if (cookieArr[i][0] === ' ') cookieArr[i] = cookieArr[i].substring(1);
      if (cookieArr[i].indexOf(cookieKey) === 0) {
        result = cookieArr[i].slice(cookieKey.length, cookieArr[i].length);
        return result;
      }
    }
    return result;
  };

  useEffect(() => {
    const checkSubmitCondition = () => {
      if (cardNum !== '' && JSON.stringify(checkStatus) === JSON.stringify([true, true, true]))
        setReadySubmit(true);
      else setReadySubmit(false);
    };

    const checkWaitCondition = () => {
      if (waitingCheckStatus === true) setReadyWait(true);
      else setReadyWait(false);
    };

    const getUserData = async () => {
      try {
        const response = await axios.get('/api/user/status');
        const { user, cluster } = response.data;
        setUserInfo({
          ...userInfo,
          userId: user.login,
          cardNum: user.card,
          status: user.card !== null ? 'in' : 'out',
          waitingNum: user.waitingNum,
          timeOut: user.timeOut
        });
        setClusterInfo({
          gaepo: cluster.gaepo,
          g_waiting: cluster.gaepoWaiting,
          seocho: cluster.seocho,
          s_waiting: cluster.seochoWaiting
        });
        if (cluster.gaepo === 150 && cluster.seocho !== 150) setWaitingCluster('gaepo');
        else if (cluster.gaepo !== 150 && cluster.seocho === 150) setWaitingCluster('seocho');
      } catch (err) {
        document.cookie = 'w_auth=; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
        window.location.href = '/';
      }
    };

    const token = getCookieValue('w_auth');
    if (token !== '') getUserData();
    // else
    // 	window.location.href = "/"; 💡

    if (JSON.stringify(checkStatus) !== JSON.stringify([true, true, true])) setCheckAll(false);
    else setCheckAll(true);

    if (status === 'out') checkSubmitCondition();
    if (waitStatus === 'ready') checkWaitCondition();
  }, [cardNum, checkStatus, status, userInfo, waitStatus, waitingCheckStatus]);

  return (
    <div id='page-wrapper'>
      <div id='checkinout'>
        <h1 id='title'>
          {status === 'in' ? '42 CheckOut' : waitStatus !== 'cannot' ? '42 Waiting' : '42 CheckIn'}
        </h1>
        <h4>
          개포 인원 : {gaepo} / 150 {gaepo === 150 ? `(${g_waiting})` : ''}
        </h4>
        <h4>
          서초 인원 : {seocho} / 150 {seocho === 150 ? `(${s_waiting})` : ''}
        </h4>
        <h3> Intra ID : {userId}</h3>
        {status === 'in' ? (
          <>
            <h3>Card Number : {cardNum}</h3>
            <Button className='submitBtn ready' handleClick={handleCheckOut} text='Check Out' />
          </>
        ) : waitStatus === 'ready' || waitStatus === 'waiting' ? (
          <>
            <div style={{ display: 'flex', justifyContent: 'center' }}>
              <div className='checkbox-wrapper'>
                {waitingNoti.map((element, id) => (
                  <label
                    key={id}
                    htmlFor={id}
                    className='checkbox-text'
                    style={{ wordBreak: 'keep-all' }}
                  >
                    <input
                      id={id}
                      className='checkbox'
                      type='checkbox'
                      checked={waitingCheckStatus}
                      onChange={() => {
                        setWaitingCheckStatus(!waitingCheckStatus);
                      }}
                    />
                    {element}
                  </label>
                ))}
              </div>
            </div>
            {waitStatus === 'waiting' ? (
              <>
                <h3>Waiting Number: {waitingNum}</h3>
                {timeOut !== null ? <Timer mm={10} ss={0} /> : null}
                <Button
                  className={`submitBtn ${timeOut !== null ? ' ready' : ''}`}
                  handleClick={() => {
                    if (timeOut !== null) setWaitStatus('cannot');
                  }}
                  text='Go to Check In'
                />
                <Button
                  className='submitBtn ready'
                  handleClick={() => {
                    if (window.confirm('대기 취소하시겠습니까?')) {
                      setWaitStatus('cannot');
                      // 대기 취소 logic 💡
                    }
                  }}
                  text='Cancel Waiting'
                />
              </>
            ) : (
              <>
                <div style={{ margin: '1rem' }}>
                  <h3>Cluster</h3>
                  {gaepo === 150 ? (
                    <label>
                      <input
                        type='radio'
                        name='cluster'
                        defaultChecked={seocho !== 150}
                        onChange={() => {
                          setWaitingCluster('gaepo');
                        }}
                      />
                      개포
                    </label>
                  ) : null}
                  {seocho === 150 ? (
                    <label>
                      <input
                        type='radio'
                        name='cluster'
                        defaultChecked={gaepo !== 150}
                        onChange={() => {
                          setWaitingCluster('seocho');
                        }}
                      />
                      서초
                    </label>
                  ) : null}
                </div>
                <Button
                  className={`submitBtn ${readyWait ? ' ready' : ''}`}
                  handleClick={handleWait}
                  text='Want To Wait'
                />
              </>
            )}
          </>
        ) : (
          <div>
            <div className='input-wrapper' style={{ textAlign: 'left' }}>
              <label htmlFor='allCheck' style={{ fontSize: '1em' }}>
                <input id='allCheck' type='checkbox' checked={checkAll} onChange={handleCheckAll} />
                모두 동의
              </label>
              <div style={{ display: 'flex', justifyContent: 'center' }}>
                <div className='checkbox-wrapper'>
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
            <UserInput
              label='Card Number'
              type='number'
              placeholder='카드 번호를 입력해주세요'
              value={cardNum}
              handleChange={e => {
                setUserInfo({
                  ...userInfo,
                  cardNum: e.target.value
                });
              }}
            />
            <Button
              className={`submitBtn ${readySubmit ? ' ready' : ''}`}
              handleClick={handleCheckIn}
              text='Check In'
            />
            {gaepo === 150 || seocho === 150 ? (
              <Button
                className='submitBtn ready'
                handleClick={() => {
                  setWaitStatus('ready');
                }}
                text='Want To Wait'
              />
            ) : null}
          </div>
        )}
      </div>
      <Modal />
    </div>
  );
}
export default CheckInPage;
