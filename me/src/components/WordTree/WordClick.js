import React, { useState, useEffect } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import axios from 'axios';
import './WordClick.css';

const WordClick = () => {
  const { answer_id } = useParams();
  const location = useLocation();
  const { word } = location.state;  // URL을 통해 넘겨받은 단어
  const [answerData, setAnswerData] = useState(null);

  useEffect(() => {
    const fetchAnswer = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          console.error('Authorization token is required');
          return;
        }

        const response = await axios.get(`${process.env.REACT_APP_API_URL}/answers/${answer_id}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        console.log(response.data);
        if (response.status === 200 && response.data) {
          setAnswerData(response.data);
        }
        
      } catch (error) {
        console.error('Error fetching answer data:', error);
      }
    };

    fetchAnswer();
  }, [answer_id]);

  if (!answerData) {
    return <div>Loading...</div>;
  }

  return (
    <div className="answer-popup">
      <div className="answer-header" style={{ backgroundColor: answerData.color }}>
        <span className="color-code">{answerData.color}</span>
        <span className="keyword">{word}</span>
      </div>
      <div className="answer-body">
        <p className="date">{answerData.date}의 질문</p>
        <hr />
        <p className="question">{answerData.question}</p>
        <p className="date">{answerData.date}의 답변</p>
        <hr />
        <p className="answer">{answerData.answer}</p>
      </div>
    </div>
  );
};

export default WordClick;
