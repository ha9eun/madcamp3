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
      <li>
          <Link to="/">
            <img src="assets/meLogo.png" alt="Home" className="navbar-logo" />
          </Link>
        </li>
        <li><Link to="/questions">기록</Link></li>
        <li><Link to="/wordtree">나무</Link></li>
        <li><Link to="/social">소셜</Link></li>
      </ul>
      <ul className="navbar-right">
        <li><Link to="/profile">프로필</Link></li>
        <li><button onClick={handleLogout}>Logout</button></li>
      </ul>
    </nav>
  );
}

export default Navbar;
