import React, { useState } from 'react';

function PasswordInput({ onSubmit, onCancel }) {
  const [password, setPassword] = useState('');

  const handleChange = (event) => {
    setPassword(event.target.value);
  };

  const handleSubmit = () => {
    onSubmit(password);
  };

  const handleCancel = () => {
    onCancel();
  };

  return (
    <div className="password-input-popup">
      <input type="password" value={password} onChange={handleChange} />
      <button onClick={handleSubmit}>OK</button>
      <button onClick={handleCancel}>Anulare</button>
    </div>
  );
}

export default PasswordInput;
