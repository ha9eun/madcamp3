import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './PostAnswer.css';

function PostAnswer() {
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const [keywords, setKeywords] = useState(['', '', '']);
  const [color, setColor] = useState('#ffffff');
  const [visibility, setVisibility] = useState('public');
  const [isEdit, setIsEdit] = useState(false);
  const [answerId, setAnswerId] = useState(null);
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
    // Fetch existing answer if available
    const fetchExistingAnswer = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          console.error('Authorization token is required');
          return;
        }

        const response = await axios.get(`${process.env.REACT_APP_API_URL}/answers/today`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        if (response.status === 200 && response.data) {
          setAnswer(response.data.answer);
          setColor(response.data.color);
          setVisibility(response.data.visibility);
          setKeywords(response.data.keywords || ['', '', '']);
          setIsEdit(true); // 기존 답변이 있음을 표시
          setAnswerId(response.data.answer_id); // 답변 ID 설정
        }
      } catch (error) {
        if (error.response.status === 404) {
          setIsEdit(false); // 기존 답변이 없음을 표시
        } else {
          console.error('Error fetching existing answer:', error);
        }
      }
    };

    fetchExistingAnswer();
  }, []);

  // Gemini Setting
  const { GoogleGenerativeAI } = require("@google/generative-ai");
  const genAI = new GoogleGenerativeAI(process.env.REACT_APP_GOOGLE_API_KEY);
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

  const handleSubmit = useCallback(async (newKeywords) => {
    const token = localStorage.getItem('token');
    console.log(newKeywords);

    try {
      const url = `${process.env.REACT_APP_API_URL}/answers${isEdit ? `/${answerId}` : ''}`;
      const method = isEdit ? 'put' : 'post';

      const response = await axios({
        method,
        url,
        data: {
          answer,
          color,
          visibility,
          keywords: newKeywords,
        },
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      if (response.status === 201 || response.status === 200) {
        alert('Answer submitted successfully!');
        navigate('/questions');
      } else {
        alert('Failed to submit answer.');
      }
    } catch (error) {
      if (error.response.status === 403) {
        alert("토큰이 만료되었습니다. 다시 로그인 해주세요.");
        navigate('/login');
      }
      console.error('Error submitting answer:', error);
      alert('There was an error submitting your answer.');
    }
  }, [answer, color, visibility, isEdit, answerId, navigate]);

  const run = useCallback(async () => {
    const prompt = "Extract three keywords from the following text. Just give me the Korean keywords without any explanation, as 'key1, key2, key3'"

    const result = await model.generateContent(`${prompt} ${answer}`);
    const response = result.response;
    const text = await response.text();
    const textarray = text.split(',').map(keyword => keyword.trim());
    console.log(textarray);
    setKeywords(textarray);

    // 키워드 설정이 완료된 후 handleSubmit 호출
    handleSubmit(textarray);
  }, [answer, model, handleSubmit]);

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    await run();
  };

  const handleAnswerChange = (e) => {
    setAnswer(e.target.value);
  };

  const handleColorChange = (e) => {
    setColor(e.target.value);
  };

  const toggleVisibility = () => {
    setVisibility((prev) => (prev === 'public' ? 'private' : 'public'));
  };

  return (
    <div className="answer-details-container">
      <div className="questions-header">
        <h1>오늘의 질문 <span>글과 색으로 답변하기</span></h1>
        <div className="question-box">
          {question}
        </div>
      </div>
      <form onSubmit={handleFormSubmit}>
        <div className="edit-section">
          <div className="color-picker">
            <input type="color" value={color} onChange={handleColorChange} />
            {/* <label htmlFor="colorInput">색 선택하기</label> */}
          </div>
          <div className="answer-editor">
            <textarea 
              className="answer-textarea" 
              value={answer} 
              onChange={handleAnswerChange} 
              placeholder="나 자신에 대해 궁금히 생각해보는 시간입니다. 40자 이상으로 작성해봅시다!"
            />
            <span 
              className="visibility-icon"
              onClick={toggleVisibility}
              role="button"
              aria-label={visibility === 'public' ? '공개' : '비공개'}
            >
              {visibility === 'public' ? '🌐' : '🔒'}
            </span>
            <button className="save-button" type="submit">기록 저장하기</button>
          </div>
        </div>
      </form>
    </div>
  );
}

export default PostAnswer;
