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
    // Fetch friends' today answers from the server
    const fetchFriendsTodayAnswers = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/friends/today`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        const answers = response.data; // Assuming the response is an array of answers
        console.log(answers);
        if (answers.length > 0) {
          setAnswers(answers); // Set the friends' today answers
        }
      } catch (error) {
        console.error('Error fetching friends\' today answers:', error);
      }
    };

    fetchFriendsTodayAnswers();
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

  const handleLike = async (answerId, liked) => {
    try {
      const token = localStorage.getItem('token');
      if (liked) {
        await axios.delete(`${process.env.REACT_APP_API_URL}/likes`, {
          data: { answer_id: answerId },
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
      } else {
        await axios.post(`${process.env.REACT_APP_API_URL}/likes`, { answer_id: answerId }, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
      }
      // Update the answers state
      setAnswers(prevAnswers => prevAnswers.map(answer =>
        answer.answer_id === answerId ? { ...answer, liked: !liked } : answer
      ));
    } catch (error) {
      console.error('Error toggling like:', error);
    }
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
        <h2>친구들의 오늘 답변</h2>
        <div className="answer-container">
          {answers.length > 0 ? (
            answers.map((answer, index) => (
              <div key={index} className="answer-box">
                <p className="nickname">{answer.nickname}</p>
                <p className="question"><strong>Q</strong> {answer.question}</p>
                <p className="answer">{answer.answer}</p>
                <div className="answer-details">
                  <span className="color-box" style={{ backgroundColor: answer.color }}></span>
                  <div className="keywords">
                    {answer.keywords.map((keyword, idx) => (
                      <span key={idx} className="keyword">{keyword}</span>
                    ))}
                  </div>
                  <button
                    className={`like-button ${answer.liked ? 'liked' : ''}`}
                    onClick={() => handleLike(answer.answer_id, answer.liked)}
                  >
                    {answer.liked ? 'Unlike' : 'Like'}
                  </button>
                </div>
              </div>
            ))
          ) : (
            <p>친구들의 오늘 답변이 없습니다.</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default Social;
