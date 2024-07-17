import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import './ViewAnswer.css';

const ViewAnswer = () => {
  const { answer_id } = useParams();
  const [answerDetails, setAnswerDetails] = useState(null);
  const [error, setError] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [updatedAnswer, setUpdatedAnswer] = useState('');
  const [updatedColor, setUpdatedColor] = useState('');
  const [updatedVisibility, setUpdatedVisibility] = useState('');

  useEffect(() => {
    const fetchAnswerDetails = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          setError('Authorization token is required');
          return;
        }

        const response = await axios.get(`${process.env.REACT_APP_API_URL}/answers/${answer_id}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        if (response.status === 200) {
          setAnswerDetails(response.data);
          setUpdatedAnswer(response.data.answer);
          setUpdatedColor(response.data.color);
          setUpdatedVisibility(response.data.visibility);
        } else {
          setError(response.data.message || 'Error retrieving answer details');
        }
      } catch (err) {
        setError(err.response?.data?.message || 'An error occurred while fetching the answer details');
      }
    };

    fetchAnswerDetails();
  }, [answer_id]);

  const handleUpdate = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('Authorization token is required');
        return;
      }

      const response = await axios.put(`${process.env.REACT_APP_API_URL}/answers/${answer_id}`, 
      {
        color: updatedColor,
        answer: updatedAnswer,
        visibility: updatedVisibility,
      }, 
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      if (response.status === 200) {
        setAnswerDetails({ ...answerDetails, color: updatedColor, answer: updatedAnswer, visibility: updatedVisibility });
        setIsEditing(false);
      } else {
        setError(response.data.message || 'Error updating answer');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'An error occurred while updating the answer');
    }
  };

  const toggleVisibility = () => {
    setUpdatedVisibility((prev) => (prev === 'public' ? 'private' : 'public'));
  };

  if (error) {
    return <div className="error">{error}</div>;
  }

  if (!answerDetails) {
    return <div>Loading...</div>;
  }

  // 날짜 형식 변환
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('ko-KR', options);
  };

  return (
    <div className="answer-details-container">
      <h2 className="header-title">오늘의 질문 <span className="sub-title">글과 색깔로 답변하기</span></h2>
      <div className="question-box">{answerDetails.question}</div>

      {isEditing ? (
        <div className="edit-section">
          <div className="color-picker">
            <label>색깔 선택</label>
            <input type="color" value={updatedColor} onChange={(e) => setUpdatedColor(e.target.value)} />
          </div>
          <div className="answer-editor">
            <textarea 
              className="answer-textarea" 
              value={updatedAnswer} 
              onChange={(e) => setUpdatedAnswer(e.target.value)}
              placeholder="나 자신에 대해 궁금히 생각해보는 시간입니다. 40자 이상으로 작성해봅시다!"
            />
            <span 
              className="visibility-icon"
              onClick={toggleVisibility}
              role="button"
              aria-label={updatedVisibility === 'public' ? '공개' : '비공개'}
            >
              {updatedVisibility === 'public' ? '🌐' : '🔒'}
            </span>
            <button className="save-button" onClick={handleUpdate}>기록 저장하기</button>
          </div>
        </div>
      ) : (
        <div className="view-section">
          <div className="viewcolor-box" style={{ backgroundColor: answerDetails.color }}></div>
          <p className="viewanswer-text">{answerDetails.answer}</p>
          <p className="date-text">{formatDate(answerDetails.date)}</p>
          <button className="edit-button" onClick={() => setIsEditing(true)}>수정</button>
        </div>
      )}
    </div>
  );
};

export default ViewAnswer;
