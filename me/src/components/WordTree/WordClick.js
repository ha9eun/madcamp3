import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

function WordClick() {
  const location = useLocation();
  const navigate = useNavigate();

  // 클릭된 단어 정보는 location.state에서 받아옵니다.
  const { word, frequency } = location.state || { word: '', frequency: 0 };

  return (
    <div style={{ textAlign: 'center', marginTop: '50px' }}>
      <h2>Word Details</h2>
      <p><strong>Word:</strong> {word}</p>
      <p><strong>Frequency:</strong> {frequency}</p>
      <button onClick={() => navigate(-1)}>Back</button>
    </div>
  );
}

export default WordClick;
