import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import MyCalendar from '../Calendar/Calendar';
import './Questions.css';
import { AnswerContext } from '../../context/AnswerContext';

function Questions() {
  const [question, setQuestion] = useState('');
  const [preview, setPreview] = useState('');
  const { selectedAnswerId } = useContext(AnswerContext);
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch question from the server
    const fetchQuestion = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/questions/today`);
        const question = response.data.question;
        console.log(response.data.question);
        if (question.length > 0) {
          setQuestion(question);
        }
      } catch (error) {
        console.error('Error fetching question:', error);
      }
    };

    fetchQuestion();
  }, []);

  useEffect(() => {
    // Fetch preview from the server
    const fetchPreview = async () => {
      if (!selectedAnswerId) return;

      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/answers/${selectedAnswerId}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        const preview = response.data;
        console.log(preview);
        setPreview(preview);
      } catch (error) {
        if (error.response.status === 403) {
          alert("토큰이 만료되었습니다. 다시 로그인 해주세요.");
          navigate('/login');
        }
        console.error('Error fetching preview:', error);
      }
    };

    fetchPreview();
  }, [selectedAnswerId, navigate]);

  const handleQuestionClick = () => {
    navigate('/postanswer');
  };

  const handlePreviewClick = () => {
    if (selectedAnswerId) {
      navigate(`/viewanswer/${selectedAnswerId}`);
    }
  };

  return (
    <div className="questions-container">
      <div className="questions-header">
        <h1>오늘의 질문 <span>질문 클릭해서 답변하기</span></h1>
        <div className="question-box" onClick={handleQuestionClick} style={{ cursor: 'pointer' }}>
          {question}
        </div>
      </div>
      <div className="questions-content">
        <h2>지난 기록</h2>
        <div className="content-box">
          <MyCalendar />
          <div className="text-box" onClick={handlePreviewClick} style={{ cursor: 'pointer' }}>
            {preview ? (
              selectedAnswerId ? (
              <div>
                <div className="question-date">{new Date(preview.date).toISOString().split('T')[0]}의 질문</div>
                <div className="line"></div>
                <div className="question-text">{preview.question}</div>
                <div className="answer-date">{new Date(preview.date).toISOString().split('T')[0]}의 답변</div>
                <div className="line"></div>
                <div className="answer-contents">
                  <div className="answer-text">
                    {preview.keywords.map((keyword, index) => (
                      <div key={index}>{keyword}</div>
                    ))}
                  </div>
                  <div className="color-box" style={{ backgroundColor: preview.color }}>
                    {(preview.color).toUpperCase()}
                  </div>
                </div>
              </div>
              ) : (
                <div className="centered">이 날엔 답변이 없어요</div>
              )
            ) : (
              <div className="centered">날짜 선택하기</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Questions;
