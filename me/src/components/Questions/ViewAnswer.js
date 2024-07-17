import React, { useState, useEffect, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLock, faLockOpen } from '@fortawesome/free-solid-svg-icons';
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
  const [keywords, setKeywords] = useState(['', '', '']);
  const navigate = useNavigate();

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

  // Gemini Setting
  const { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } = require("@google/generative-ai");
  const genAI = new GoogleGenerativeAI(process.env.REACT_APP_GOOGLE_API_KEY);
  const model = genAI.getGenerativeModel({
    model: "gemini-1.5-flash",
    safety_settings: [
      {
        // category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
        threshold: HarmBlockThreshold.BLOCK_NONE,
      },
    ],
  });

  const handleUpdate = useCallback(async (newKeywords) => {
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
        keywords: newKeywords,
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
  }, [answerDetails, updatedAnswer, updatedColor, updatedVisibility, answer_id]);

  const run = useCallback(async () => {
    const prompt = "Extract three keywords from the following text. Just give me the Korean keywords without any explanation, as 'key1, key2, key3'"
    console.log(`Prompt: ${prompt} ${updatedAnswer}`);
    try {
      const result = await model.generateContent(`${prompt} ${updatedAnswer}`);
      const response = result.response;
      const text = await response.text();
      const textarray = text.split(',').map(keyword => keyword.trim());
      console.log(textarray);
      setKeywords(textarray);

      // 키워드 설정이 완료된 후 handleUpdate 호출
      handleUpdate(textarray);
    } catch (error) {
      if (error.message.includes('SAFETY')) {
        console.error('SAFETY error occurred:', error);
        alert('안전하지 않은 응답이 생성되었습니다. 다른 텍스트를 시도해주세요.');
      } else {
        console.error('Error generating keywords:', error);
      }
    }
  }, [updatedAnswer, model, handleUpdate]);

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    await run();
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
      <div className="questions-header">
        <h1>과거의 질문 <span>{formatDate(answerDetails.date)}</span></h1>
        <div className="question-box">
          {answerDetails.question}
        </div>
      </div>
      {isEditing ? (
        <form onSubmit={handleFormSubmit}>
          <div className="edit-section">
            <div className="color-picker">
            <input type="color" value={updatedColor} onChange={(e) => setUpdatedColor(e.target.value)} />
              {/* <label htmlFor="colorInput">색 선택하기</label> */}
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
                <FontAwesomeIcon icon={updatedVisibility === 'public' ? faLockOpen : faLock} />
              </span>
              <button className="save-button" type="submit">기록 저장하기</button>
            </div>
          </div>
        </form>

      ) : (
        <div className="view-section">
          <div className="view-content">
            <div className="viewanswer-text">{answerDetails.answer}</div>
            <div className="viewcolor-box" style={{ backgroundColor: answerDetails.color }}>
              {answerDetails.color.toUpperCase()}
            </div>
          </div>
          <div className="buttons">
            <button className="goback-button" onClick={() => navigate('/questions')}>이전</button>
            <button className="edit-button" onClick={() => setIsEditing(true)}>수정</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ViewAnswer;
