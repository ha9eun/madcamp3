import React, { useState } from 'react';
import { SketchPicker } from 'react-color';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function PostAnswer() {
  const [answer, setAnswer] = useState('');
  const [color, setColor] = useState('#fff');
  const [visibility, setVisibility] = useState('public');
  const navigate = useNavigate();

  const handleAnswerChange = (e) => {
    setAnswer(e.target.value);
  };

  const handleColorChange = (color) => {
    setColor(color.hex);
  };

  const handleVisibilityChange = (e) => {
    setVisibility(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');

    try {
      const response = await axios.post(`${process.env.REACT_APP_API_URL}/answers`, {
        answer,
        color,
        visibility
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
        alert("세션이 만료되었습니다. 다시 로그인 해주세요.");
        navigate('/login');
      }
      console.error('Error submitting answer:', error);
      alert('There was an error submitting your answer.');
    }
  };

  return (
    <div>
      <h2>Answer the Question</h2>
      <form onSubmit={handleSubmit}>
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
