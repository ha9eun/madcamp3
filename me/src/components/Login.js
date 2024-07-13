import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import CryptoJS from 'crypto-js';
import '../App.css';

function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    const users = JSON.parse(localStorage.getItem('users')) || [];
    const hashedPassword = CryptoJS.SHA256(password).toString();
    const user = users.find(user => user.username === username && user.password === hashedPassword);
    if (user) {
      localStorage.setItem('currentUser', JSON.stringify({ username: user.username }));
      navigate('/main');
    } else {
      alert('Invalid credentials');
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
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
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
