import React from 'react';
import '../styles/Modal.css';

const Modal = () => {
  const copyText = () => {
    const tmpTextArea = document.createElement('textarea');
    tmpTextArea.value = 'WeL0ve42Seoul';
    document.body.appendChild(tmpTextArea);
    tmpTextArea.select();
    tmpTextArea.setSelectionRange(0, 9999);
    document.execCommand('copy');
    document.body.removeChild(tmpTextArea);
    const modal = document.getElementById('myModal');
    modal.style.display = 'none';
  };

  return (
    <div id='myModal' className='modal'>
      <div className='modal-content'>
        <p className='text'>42 Wi-Fi를 이용해주세요</p>
        <p className='text'>Wi-Fi : 42 Guest</p>
        <p className='text'>pw : WeL0ve42Seoul</p>
        <button className='close' onClick={copyText}>
          Copy
        </button>
      </div>
    </div>
  );
};

export default Modal;
