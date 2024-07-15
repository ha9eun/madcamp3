// src/components/ViewAnswer/ViewAnswer.js

import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './ViewAnswer.css';
import { AnswerContext } from '../../context/AnswerContext';

const ViewAnswer = () => {
  const { answer_id } = useParams();
  const [answerDetails, setAnswerDetails] = useState(null);
  const [error, setError] = useState('');
  const { selectedAnswerId } = useContext(AnswerContext);
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

  return (
    <div className="answer-details">
      <h2>Answer Details</h2>
      <p><strong>User ID:</strong> {answerDetails.user_id}</p>
      <p><strong>Date:</strong> {answerDetails.date}</p>
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
