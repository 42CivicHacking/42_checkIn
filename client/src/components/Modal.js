import React from 'react';
import '../styles/Modal.css';

const Modal = ({ onClick }) => {
  return (
    <div id='myModal' className='modal'>
      <div className='modal-content'>
        <p className='text'>42 Guest wifi를 이용해주세요.</p>
        <div style={{ display: 'flex' }}>
          <p className='text'>WeL0ve42Seoul</p>
          <button className='copy-btn'>copy</button>
        </div>
        <button className='close' onClick={onClick}>
          확인
        </button>
      </div>
    </div>
  );
};

export default Modal;
