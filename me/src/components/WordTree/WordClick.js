import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './WordClick.css';

function WordClick({ word, answerId, onClose }) {
  const [answerDetails, setAnswerDetails] = useState(null);

  useEffect(() => {
    const fetchAnswerDetails = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/answers/${answerId}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        setAnswerDetails(response.data);
      } catch (error) {
        console.error('Error fetching answer details:', error);
      }
    };
    fetchAnswerDetails();
  }, [answerId]);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toISOString().split('T')[0];
  };

  if (!answerDetails) {
    return null;
  }

  return (
    <div className="popup-container">
      <div className="popup-content">
        <button className="close-button" onClick={onClose}>X</button>
        <div className="header">
          <div className="color-info">
            <div className="color-code" style={{ backgroundColor: answerDetails.color }}>{answerDetails.color}</div>
          </div>
          <div className="word">" {word} "</div>
          <div className="color-line" style={{ backgroundColor: answerDetails.color }}></div>
        </div>
        <div className="question-section">
          <div className="date">{formatDate(answerDetails.date)}의 질문</div>
          <div className="click-line"></div>
          <p className="click-text">{answerDetails.question}</p>
        </div>
        <div className="answer-section">
          <div className="date">{formatDate(answerDetails.date)}의 답변</div>
          <div className="click-line"></div>
          <p className="click-text">{answerDetails.answer}</p>
        </div>
      </div>
    </div>
  );
}

export default WordClick;
