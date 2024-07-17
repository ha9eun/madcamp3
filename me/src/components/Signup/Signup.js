import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import CryptoJS from 'crypto-js';
import axios from 'axios';
import './Signup.css';

function Signup() {
  const [userId, setUserId] = useState('');
  const [password, setPassword] = useState('');
  const [nickname, setNickname] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    setErrorMessage(''); // 초기화

    const hashedPassword = CryptoJS.SHA256(password).toString();

    try {
      const response = await axios.post(`${process.env.REACT_APP_API_URL}/users`, {
        userId,
        password: hashedPassword,
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
    <div className="signup-container">
      <div className="left-content">
        <img src="/assets/meLogoforlogin.png" alt="Logo" className="logo" />
      </div>
      <div className="right-content signup">
        <h2>회원가입</h2>
        <form onSubmit={handleSignup}>
          <input
            type="text"
            placeholder="아이디"
            value={userId}
            onChange={(e) => setUserId(e.target.value)}
          />
          <input
            type="password"
            placeholder="비밀번호"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <input
            type="text"
            placeholder="닉네임"
            value={nickname}
            onChange={(e) => setNickname(e.target.value)}
          />
          <button type="submit">회원가입</button>
        </form>
        <Link to="/login">로그인</Link>
      </div>
    </div>
  );
}

export default Signup;
