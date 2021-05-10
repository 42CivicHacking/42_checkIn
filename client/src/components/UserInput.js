import React from 'react';

const UserInput = ({ label, type, placeholder, value, handleChange }) => {
  return (
    <div className='input-wrapper'>
      <h3>{label}</h3>
      <div id='card'>
        <input
          type={type}
          name='text'
          value={value}
          onChange={handleChange}
          placeholder={placeholder}
          style={{ textAlign: 'center' }}
        ></input>
      </div>
    </div>
  );
};

export default UserInput;
