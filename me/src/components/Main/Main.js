import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Main.css';

function Main() {
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState([]);

  useEffect(() => {
    // Fetch recent questions from the server
    const fetchRecentQuestions = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/questions/recent`);
        const questions = response.data; // Assuming the response is an array of questions
        console.log(questions);
        if (questions.length > 0) {
          setQuestions(questions); // Set the recent questions
        }
      } catch (error) {
        console.error('Error fetching recent questions:', error);
      }
    };

    fetchRecentQuestions();
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

  return (
    <div className="main">
      <div className="question-list">
        <h1>질문 기록들 <span>기록 더보기{' \u25B6'}</span></h1>
        <div className="today-question">
          {questions[2] ? questions[2].question : '오늘의 질문이 없습니다.'}
        </div>
        <div className="prev-question">
          {questions[1] ? questions[1].question : '어제의 질문이 없습니다.'}
        </div>
        <div className="prev-question">
          {questions[0] ? questions[0].question : '그저께의 질문이 없습니다.'}
        </div>
      </div>
      <div className="answer-list">
        <h2>답변 기록들</h2>
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
      <div className="random-trees">
        <h3>이웃 나무들 <span>나무 더보기{' \u25B6'}</span></h3>
        <div className="tree-container">
          <div className="tree-box">
          </div>
          <div className="tree-box">
          </div>
          <div className="tree-box">
          </div>
        </div>
      </div>
    </div>
  );
}

export default Main;
