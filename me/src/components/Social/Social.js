import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Social.css';

function Social() {
  const [searchTerm, setSearchTerm] = useState('');
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    // 서버에서 모든 유저를 불러오기
    const fetchUsers = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/users`);
        setUsers(response.data);
      } catch (error) {
        console.error('유저 목록을 불러오는데 실패했습니다.', error);
      }
    };
    fetchUsers();
  }, []);

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    if (e.target.value === '') {
      setFilteredUsers([]);
    } else {
      const filtered = users.filter(user => user.user_id.includes(e.target.value));
      setFilteredUsers(filtered);
    }
  };

  const handleUserClick = (userId) => {
    navigate(`/friend/${userId}`);
  };

  return (
    <div className="social-container">
      <div className="search-container">
        <input
          type="text"
          placeholder="아이디로 검색"
          value={searchTerm}
          onChange={handleSearch}
          className="search-bar"
        />
      </div>
      <div className="results-box">
        {filteredUsers.length > 0 ? (
          filteredUsers.map((user, index) => (
            <div key={index} className="user-box" onClick={() => handleUserClick(user.user_id)}>
              <p>{user.user_id}</p>
              <p>{user.nickname}</p>
            </div>
          ))
        ) : (
          searchTerm && <div className="no-user">유저가 없습니다.</div>
        )}
      </div>
      <div className="section">
        <div className="section-title">친구의 나무</div>
        <div className="card-grid">
          <div className="card"></div>
          <div className="card"></div>
          <div className="card"></div>
        </div>
      </div>
      <div className="section">
        <div className="section-title">익명의 나무</div>
        <div className="card-grid">
          <div className="card"></div>
          <div className="card"></div>
          <div className="card"></div>
        </div>
      </div>
    </div>
  );
}

export default Social;
