import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../App.css'; // 추가: CSS 파일 가져오기

function Navbar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('currentUser');
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <ul className="navbar-left">
        <li><Link to="/">Home</Link></li>
        <li><Link to="/questions">Questions</Link></li>
        <li><Link to="/wordtree">WordTree</Link></li>
        <li><Link to="/social">Social</Link></li>
      </ul>
      <ul className="navbar-right">
        <li><Link to="/profile">Profile</Link></li>
        <li><button onClick={handleLogout}>Logout</button></li>
      </ul>
    </nav>
  );
}

export default Navbar;
