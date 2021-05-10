import React from 'react';
import '../styles/Modal.css';

const Modal = ({ onClick }) => {
  const copyText = () => {
    const tmpTextArea = document.createElement('textarea');
    tmpTextArea.value = 'WeL0ve42Seoul';
    document.body.appendChild(tmpTextArea);
    tmpTextArea.select();
    tmpTextArea.setSelectionRange(0, 9999);
    document.execCommand('copy');
    document.body.removeChild(tmpTextArea);
    // alert('copy!');
    const modal = document.getElementById('myModal');
    modal.style.display = 'none';
  };

  return (
    <div id='myModal' className='modal'>
      <div className='modal-content'>
        <p className='text'>42 Guest wifi를 이용해주세요</p>
        <div className='pw-wrapper'>
          <p className='text' style={{ borderBottom: '1px solid #888' }}>
            WeL0ve42Seoul
          </p>
          <button className='copy-btn' onClick={copyText}>
            Copy
          </button>
        </div>
        <button className='close' onClick={onClick}>
          확인
        </button>
      </div>
    </div>
  );
};

export default Modal;
