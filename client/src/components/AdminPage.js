import React, { useEffect, useRef, useState } from 'react';
import SearchBar from './SearchBar';
import * as moment from 'moment';
import axios from 'axios';
import '../styles/AdminPage.css';

function AdminPage() {
  const [LogType, setLogType] = useState(0);
  const [Logs, setLogs] = useState([]);
  const [Page, setPage] = useState(0);

  const ref = useRef();

  const checkAdmin = async () => {
    try {
      const response = await axios.get(`/api/user/status`);
      if (!(response.data && response.data.isAdmin)) window.location.href = '/submit';
    } catch (err) {
      console.log(err);
      window.location.href = '/';
    }
  };

  useEffect(() => {
    checkAdmin();
  }, []);

  const handleClusterButton = () => {
    setLogs([]);
    setLogType(0);
    setPage(0);
  };

  const handleStudentButton = () => {
    setLogs([]);
    setLogType(1);
    setPage(0);
  };

  const handleCardButton = () => {
    setLogs([]);
    setLogType(2);
    setPage(0);
  };

  const handleCheckInButton = () => {
    setLogs([]);
    setLogType(3);
    setPage(0);
  };

  const handleAllCaradButton = () => {
    setLogs([]);
    setLogType(4);
    setPage(0);
  };

  const checkOutOnClick = async e => {
    try {
      const userId = e.target.getAttribute('data');
      const response = await axios.post(`/api/user/forceCheckOut/${userId}`);
      setLogs([]);
      ref.current.onSubmit(e);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div
      style={{
        justifyContent: 'center',
        alignItems: 'center',
        display: 'flex',
        flexDirection: 'column'
      }}
    >
      <div className='selectorWrapper'>
        <div
          style={{
            display: 'flex',
            // width: "50%",
            justifyContent: 'center'
          }}
        >
          <button className='filterBtn' onClick={handleClusterButton}>
            클러스터 로그
          </button>
          <button className='filterBtn' onClick={handleStudentButton}>
            학생 로그
          </button>
          <button className='filterBtn' onClick={handleCardButton}>
            카드 로그
          </button>
          <button className='filterBtn' onClick={handleCheckInButton}>
            미반납 카뎃
          </button>
          <button className='filterBtn' onClick={handleAllCaradButton}>
            모든 카드 정보 보기
          </button>
        </div>
        <div
          style={{
            display: 'flex',
            // border: "1px solid whitesmoke",
            width: '50%',
            padding: '1rem',
            height: '5rem'
          }}
        >
          <SearchBar type={LogType} setLogs={setLogs} ref={ref} Page={Page} setPage={setPage} />
        </div>
      </div>
      <div style={{ overflowX: 'scroll', margin: 'auto' }}>
        <div className='logWrapper'>
          {LogType === 4 ? <div className='logBox1'>카드 번호</div> : null}
          <div className='logBox3'>시간</div>
          <div className='logBox1'>출/입</div>
          <div className='logBox1'>로그인</div>
          <div className='logBox1'>카드 번호</div>
          <div className='logBox1'>클러스터</div>
          <div className='logBox1'>강제 퇴실</div>
        </div>
        <hr />
        {Logs &&
          Logs.map((log, index) => {
            const date = new Date(log.createdAt);
            return (
              <div key={index} className='logWrapper'>
                {log.id ? <div className='logBox1'>{log.id}</div> : null}
                {date ? (
                  <div className='logBox3'>{moment(date).format('MM월 DD일 HH:mm')}</div>
                ) : null}
                {log.logType ? <div className='logBox1'>{log.logType}</div> : null}
                {log.user ? <div className='logBox1'>{log.user.userName}</div> : null}
                {log.card ? <div className='logBox1'>{log.card.cardId}</div> : null}
                {log.card ? (
                  <div className='logBox1'>{log.card.type === 0 ? '개포' : '서초'}</div>
                ) : null}
                {log.user ? (
                  <div className='logBox1' data={log.user._id} onClick={checkOutOnClick}>
                    {log.card.cardId === log.user.cardId ? '퇴실처리하기' : null}
                  </div>
                ) : null}
              </div>
            );
          })}
      </div>
    </div>
  );
}

export default AdminPage;
