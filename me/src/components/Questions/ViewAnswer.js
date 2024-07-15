// src/components/ViewAnswer/ViewAnswer.js

import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import './ViewAnswer.css';


const ViewAnswer = () => {
  const { answer_id } = useParams();
  const [answerDetails, setAnswerDetails] = useState(null);
  const [error, setError] = useState('');


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
        } else {
          setError(response.data.message || 'Error retrieving answer details');
        }
      } catch (err) {
        setError(err.response?.data?.message || 'An error occurred while fetching the answer details');
      }
    };

    fetchAnswerDetails();
  }, [answer_id]);

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
      <p><strong>Answer:</strong> {answerDetails.answer}</p>
      <p><strong>Color:</strong> {answerDetails.color}</p>
      <p><strong>Visibility:</strong> {answerDetails.visibility}</p>
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
