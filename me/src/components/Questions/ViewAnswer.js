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

  if (error) {
    return <div className="error">{error}</div>;
  }

  if (!answerDetails) {
    return <div>Loading...</div>;
  }

  // 날짜 형식 변환
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: '2-digit', day: '2-digit' };
    return new Date(dateString).toLocaleDateString('ko-KR', options);
  };

  return (
    <div className="answer-details">
      <h2>Answer Details</h2>
      <p><strong>Date:</strong> {formatDate(answerDetails.date)}</p>
      <p><strong>Question:</strong> {answerDetails.question}</p>
      
      {isEditing ? (
        <>
          <div className="form-group">
            <label><strong>Answer:</strong></label>
            <textarea value={updatedAnswer} onChange={(e) => setUpdatedAnswer(e.target.value)} />
          </div>
          <div className="form-group">
            <label><strong>Color:</strong></label>
            <input type="text" value={updatedColor} onChange={(e) => setUpdatedColor(e.target.value)} />
          </div>
          <div className="form-group">
            <label><strong>Visibility:</strong></label>
            <select value={updatedVisibility} onChange={(e) => setUpdatedVisibility(e.target.value)}>
              <option value="public">Public</option>
              <option value="private">Private</option>
            </select>
          </div>
          <button onClick={handleUpdate}>Save</button>
          <button onClick={() => setIsEditing(false)}>Cancel</button>
        </>
      ) : (
        <>
          <p><strong>Answer:</strong> {answerDetails.answer}</p>
          <p><strong>Color:</strong> {answerDetails.color}</p>
          <p><strong>Visibility:</strong> {answerDetails.visibility}</p>
          <button onClick={() => setIsEditing(true)}>Edit</button>
        </>
      )}

      <div><strong>Keywords:</strong> 
        <ul>
          {answerDetails.keywords.map((keyword, index) => (
            <li key={index}>{keyword}</li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default ViewAnswer;
