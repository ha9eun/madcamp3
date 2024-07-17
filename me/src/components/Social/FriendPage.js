import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import './FriendPage.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import WordTreeFr from '../WordTree/WordTreeFr';

function FriendPage() {
  const { friendId } = useParams();
  const [friendInfo, setFriendInfo] = useState({});
  const [answers, setAnswers] = useState([]);
  const [isFollowing, setIsFollowing] = useState(false);

  useEffect(() => {
    const fetchFriendAnswers = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/answers/user/${friendId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const { nickname, isFollowing, answers } = response.data;
        setFriendInfo({ nickname });
        setAnswers(answers);
        setIsFollowing(isFollowing);
      } catch (error) {
        console.error('Error fetching friend answers:', error);
      }
    };

    fetchFriendAnswers();
  }, [friendId]);

  const handleFollowToggle = async () => {
    try {
      const token = localStorage.getItem('token');
      if (isFollowing) {
        // Unfollow friend
        await axios.delete(`${process.env.REACT_APP_API_URL}/friends/${friendId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
      } else {
        // Follow friend
        await axios.post(
          `${process.env.REACT_APP_API_URL}/friends/${friendId}`,
          {},
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
      }
      setIsFollowing(!isFollowing);
    } catch (error) {
      console.error('Error toggling follow status:', error);
    }
  };

  const handleLikeToggle = async (answerId, liked) => {
    try {
      const token = localStorage.getItem('token');
      if (liked) {
        // Unlike answer
        await axios.delete(`${process.env.REACT_APP_API_URL}/likes/${answerId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
      } else {
        // Like answer
        await axios.post(
          `${process.env.REACT_APP_API_URL}/likes/${answerId}`,
          {},
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
      }
      setAnswers((prevAnswers) =>
        prevAnswers.map((answer) =>
          answer.answer_id === answerId
            ? { ...answer, liked: !answer.liked }
            : answer
        )
      );
    } catch (error) {
      console.error('Error toggling like status:', error);
    }
  };

  return (
    <div className="friend-page">
        <div className="friend-tree">
          <WordTreeFr userId={friendId} />
        </div>
      <div className="friend-answers">
        <h2>{friendInfo.nickname}님의 공개된 답변들</h2>
        <button onClick={handleFollowToggle} className="follow-button">
          {isFollowing ? '팔로잉' : '팔로우'}
        </button>
        <div className="answer-container">
          {answers.length > 0 ? (
            answers.map((answer, index) => (
              <div key={index} className="answer-box">
                <p className="question">
                  <strong>Q:</strong> {answer.question}
                </p>
                <p className="answer">{answer.answer}</p>
                <button
                  onClick={() => handleLikeToggle(answer.answer_id, answer.liked)}
                  className="social-like-button"
                >
                  <FontAwesomeIcon icon="heart" className={answer.liked ? 'liked' : ''} />
                </button>
              </div>
            ))
          ) : (
            <p>공개된 답변이 없습니다.</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default FriendPage;
