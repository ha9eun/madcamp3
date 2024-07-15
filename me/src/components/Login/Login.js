import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import CryptoJS from 'crypto-js';
import '../../App.css';

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
        //password
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
        <h1>Welcome to Our Service</h1>
        <p>
          Here you can provide some information about your service,
          mission, or anything you want to communicate to your users.
        </p>
      </div>
      <div className="right-content login">
        <h2>Login</h2>
        <form onSubmit={handleLogin}>
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
          <button type="submit">Login</button>
        </form>
        <Link to="/signup">Sign Up</Link>
      </div>
    </div>
  );
}

export default Login;
