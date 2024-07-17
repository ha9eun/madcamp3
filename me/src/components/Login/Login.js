import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import CryptoJS from 'crypto-js';
import '../../App.css';
import './Login.css';  // 추가: 별도의 CSS 파일을 사용할 경우

function Login() {
  const [userId, setUserId] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    // 비밀번호 해시 처리
    const hashedPassword = CryptoJS.SHA256(password).toString();

    try {
      const response = await axios.post(`${process.env.REACT_APP_API_URL}/login`, {
        userId,
        password: hashedPassword,
      });

      if (response.status === 200) {
        localStorage.setItem('currentUser', JSON.stringify({ userId }));
        localStorage.setItem('token', response.data.token);
        console.log(localStorage.getItem('token'));
        navigate('/');
      } else {
        alert(response.data.message);
      }
    } catch (error) {
      console.error('There was an error!', error);
      alert('There was an error logging in. Please try again.');
    }
  };

  return (
    <div className="login-container">
      <div className="left-content">
        <img src="/assets/newLogo.png" alt="Logo" className="logo" />
      </div>
      <div className="right-content">
        <h2>로그인</h2>
        <form onSubmit={handleLogin}>
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
          <button type="submit">로그인</button>
        </form>
        <Link to="/signup">회원가입</Link>
      </div>
    </div>
  );
}

export default Login;
