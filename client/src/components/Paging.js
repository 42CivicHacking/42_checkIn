import React from 'react';

const Paging = ({ Page, setPage }) => {
  return (
    <div>
      <button
        onClick={() => {
          setPage(Page === 0 ? 0 : Page - 1);
        }}
      >
        이전 페이지
      </button>
      <label>{Page}</label>

      <button
        onClick={() => {
          setPage(Page + 1);
        }}
      >
        다음 페이지
      </button>
    </div>
  );
};

export default Paging;
