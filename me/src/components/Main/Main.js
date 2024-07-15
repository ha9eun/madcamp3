import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../Questions/Questions.js';
import './Main.css';

function Main() {
    const [question, setQuestion] = useState('');

  useEffect(() => {
    // Fetch question from the server
    const fetchQuestion = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/questions/today`);
        const question = response.data.question; // Assuming the response is an array of questions
        console.log(response.data.question);
        if (question.length > 0) {
          setQuestion(question); // Set the first question
        }
      } catch (error) {
        console.error('Error fetching question:', error);
      }
    };

    fetchQuestion();
  }, []);

  return (
    <div className="main">
      <div className="question-list">
        <h1>질문 기록들 <span>기록 더보기{' \u25B6'}</span></h1>
        <div className="today-question">
            {question}
        </div>
        <div className="prev-question">
            {question}
        </div>
        <div className="prev-question">
            {question}
        </div>
      </div>
      <div className="answer-list">
        <h2>답변 기록들</h2>
        <div className="answer-container">
            <div className="answer-box">
                {/* {answer1} */}
            </div>
            <div className="answer-box">
                {/* {answer2} */}
            </div>
            <div className="answer-box">
                {/* {answer3} */}
            </div>
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
