import React from 'react';

const Button = ({ className, handleClick, text }) => {
  return (
    <div>
      <button className={className} onClick={handleClick}>
        {text}
      </button>
    </div>
  );
};

export default Button;
