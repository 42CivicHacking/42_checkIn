import axios from 'axios';
import React, { forwardRef, useImperativeHandle, useState } from 'react';
import '../styles/SearchBar.css';
import Paging from '../components/Paging';

const SearchBar = forwardRef((props, ref) => {
  useImperativeHandle(ref, () => ({
    onSubmit
  }));
  const [ClusterType, setClusterType] = useState(0);
  const [Page, setPage] = useState(0);
  const [Login, setLogin] = useState('');
  const [CardId, setCardId] = useState(0);

  const handleClick = e => {
    setClusterType(e.target.value);
    setPage(0);
  };

  const onSubmit = async e => {
    e.preventDefault();
    try {
      let response;
      switch (props.type) {
        case 0:
          response = await axios.get(`/api/log/${ClusterType === 0 ? 'gaepo' : 'seocho'}?${Page}`);
          break;
        case 1:
          response = await axios.get(`/api/log/user/${Login}?${Page}`);
          break;
        case 2:
          response = await axios.get(`/api/log/card/${CardId}?${Page}`);
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
    <div className='control-section'>
      <form onSubmit={onSubmit}>
        <div>
          <label>
            <input
              type='radio'
              name='cluster'
              value={0}
              checked={ClusterType == 0}
              onChange={handleClick}
            />
            개포
          </label>
          <label>
            <input
              type='radio'
              name='cluster'
              value={1}
              checked={ClusterType == 1}
              onChange={handleClick}
            />
            서초
          </label>
          <button onClick={onSubmit}>불러오기</button>
        </div>
        <Paging Page={Page} setPage={setPage} />
      </form>
    </div>
  );

  const Student = () => (
    <div className='control-section'>
      <form>
        <input
          type='text'
          name='로그인'
          value={Login}
          placeholder='인트라 아이디'
          onChange={e => {
            setLogin(e.target.value);
          }}
          style={{
            textAlign: 'center'
          }}
        />
        <button onClick={onSubmit}>불러오기</button>
        <Paging Page={Page} setPage={setPage} />
      </form>
    </div>
  );

  const Card = () => (
    <div className='control-section'>
      <form>
        <input
          type='text'
          name='text'
          value={CardId}
          placeholder='카드번호'
          onChange={e => {
            setCardId(e.target.value);
          }}
          style={{
            textAlign: 'center'
          }}
        />
        <button onClick={onSubmit}>불러오기</button>
        <Paging Page={Page} setPage={setPage} />
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
    default:
      return Cluster();
  }
});

export default SearchBar;
