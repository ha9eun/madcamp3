import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Social.css';

function Social() {
  const [searchTerm, setSearchTerm] = useState('');
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const navigate = useNavigate();
  const [answers, setAnswers] = useState([]);

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

  useEffect(() => {
    // Fetch recent answers from the server
    const fetchRecentAnswers = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/answers/recent`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        const answers = response.data; // Assuming the response is an array of answers
        console.log(answers);
        if (answers.length > 0) {
          setAnswers(answers); // Set the recent answers
        }
      } catch (error) {
        console.error('Error fetching recent answers:', error);
      }
    };

    fetchRecentAnswers();
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
      <div className="answer-list">
        <h2>친구의 답변</h2>
        <div className="answer-container">
          {answers.length > 0 ? (
            answers.map((answer, index) => (
              <div key={index} className="answer-box">
                <p className="question"><strong>Q</strong> {answer.question}</p>
                <p className="answer">{answer.answer}</p>
              </div>
            ))
          ) : (
            <p>최근 답변이 없습니다.</p>
          )}
        </div>
      </div>
      <div className="answer-list">
        <h2>익명의 답변</h2>
        <div className="answer-container">
          {answers.length > 0 ? (
            answers.map((answer, index) => (
              <div key={index} className="answer-box">
                <p className="question"><strong>Q</strong> {answer.question}</p>
                <p className="answer">{answer.answer}</p>
              </div>
            ))
          ) : (
            <p>최근 답변이 없습니다.</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default Social;
