import React, { createContext, useState } from 'react';

export const AnswerContext = createContext();

export const AnswerProvider = ({ children }) => {
  const [answers, setAnswers] = useState([]);
  const [selectedAnswerId, setSelectedAnswerId] = useState(null);

  return (
    <AnswerContext.Provider value={{ answers, setAnswers, selectedAnswerId, setSelectedAnswerId }}>
      {children}
    </AnswerContext.Provider>
  );
};
