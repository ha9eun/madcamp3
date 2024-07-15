import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function Signup() {
  const [userId, setUserId] = useState('');
  const [password, setPassword] = useState('');
  const [nickname, setNickname] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    setErrorMessage(''); // 초기화

    try {
      const response = await axios.post(`${process.env.REACT_APP_API_URL}/users`, {
        userId,
        password,
        nickname
      });
      if (response.status === 201) {
        localStorage.setItem('currentUser', JSON.stringify({ userId }));
        localStorage.setItem('token', response.data.token);
        navigate('/');
      } else if (response.status === 400) {
        setErrorMessage('정보를 모두 입력해주세요');
      } else if (response.status === 409) {
        setErrorMessage('이미 존재하는 아이디입니다');
      } else {
        setErrorMessage(response.data.message);
      }
    } catch (error) {
      if (error.response) {
        console.error('Response error:', error.response.data);
        setErrorMessage(`Error: ${error.response.data.message}`);
      } else if (error.request) {
        console.error('Request error:', error.request);
        setErrorMessage('No response received from server.');
      } else {
        console.error('Axios error:', error.message);
        setErrorMessage(`Axios error: ${error.message}`);
      }
    }
  };

  return (
    <div className="signup">
      <h2>Sign Up</h2>
      <form onSubmit={handleSignup}>
        <input
          type="text"
          placeholder="UserId"
          value={userId}
          onChange={(e) => setUserId(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <input
          type="text"
          placeholder="Nickname"
          value={nickname}
          onChange={(e) => setNickname(e.target.value)}
        />
        <button type="submit">Sign Up</button>
      </form>
      {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
    </div>
  );
}

export default Signup;
