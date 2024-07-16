import React, { useState, useEffect, useCallback } from 'react';
import { SketchPicker } from 'react-color';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';


function PostAnswer() {
  const [answer, setAnswer] = useState('');
  const [keywords, setKeywords] = useState(['', '', '']);
  const [color, setColor] = useState('#fff');
  const [visibility, setVisibility] = useState('public');
  const [readyToSubmit, setReadyToSubmit] = useState(false);
  const navigate = useNavigate();

  // Gemini Setting
  const { GoogleGenerativeAI } = require("@google/generative-ai");
  const genAI = new GoogleGenerativeAI(process.env.REACT_APP_GOOGLE_API_KEY);
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash"});

  async function run() {
    const prompt = "Extract three keywords from the following text. Just give me the Korean keywords without any explanation, as 'key1, key2, key3'"

    const result = await model.generateContent(`${prompt} ${answer}`);
    const response = result.response;
    const text = response.text();
    console.log(text);
    const textarray = text.split(',').map(keyword => keyword.trim())
    setKeywords(textarray);
  }

  const handleSubmit = useCallback(async () => {
    const token = localStorage.getItem('token');
    setReadyToSubmit(false);
    console.log(keywords);

    try {
      const response = await axios.post(`${process.env.REACT_APP_API_URL}/answers`, {
        answer,
        color,
        visibility,
        keywords,
      }, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      if (response.status === 201) { // 서버 응답 확인
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
  }, [answer, color, visibility, keywords, navigate]);

  useEffect(() => {
    if (readyToSubmit) {
      handleSubmit();
    }
  }, [keywords, readyToSubmit, handleSubmit]);

  const handleAnswerChange = (e) => {
    setAnswer(e.target.value);
  };

  const handleColorChange = (color) => {
    setColor(color.hex);
  };

  const handleVisibilityChange = (e) => {
    setVisibility(e.target.value);
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    await run();
    setReadyToSubmit(true);
  };

  return (
    <div>
      <h2>Answer the Question</h2>
      <form onSubmit={handleFormSubmit}>
        <div>
          <label>Answer:</label>
          <textarea 
            value={answer} 
            onChange={handleAnswerChange} 
            rows="10" 
            cols="50" 
            placeholder="Type your answer here..."
          />
        </div>
        <div>
          <label>Choose Color:</label>
          <SketchPicker
            color={color}
            onChangeComplete={handleColorChange}
          />
        </div>
        <div>
          <label>Visibility:</label>
          <select value={visibility} onChange={handleVisibilityChange}>
            <option value="public">Public</option>
            <option value="private">Private</option>
          </select>
        </div>
        <button type="submit">Submit Answer</button>
      </form>
    </div>
  );
}

export default PostAnswer;
