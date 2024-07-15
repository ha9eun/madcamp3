import React, { useState, useEffect, useRef } from 'react';
import WordCloudLib from 'wordcloud';

function WordTree() {
  const [words, setWords] = useState([]);
  const [initialWords, setInitialWords] = useState([]);
  const [canvasHeight, setCanvasHeight] = useState(50); // 초기 캔버스 높이 설정
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;

    const options = {
      list: words,
      gridSize: 8, // Smaller gridSize for higher resolution
      weightFactor: 6.8, // Larger weight factor for bigger text
      fontFamily: 'Times, serif',
      fontStyle: 'normal', // Set font style to normal
      color: 'black',
      backgroundColor: '#fff',
      rotateRatio: 0.5,
      rotationSteps: 2,
      drawOutOfBound: false,
      shuffle: false,
      click: (item) => {
        alert(item[0] + ': ' + item[1]);
      },
      ellipticity: 0.6,
      shape: 'circle',
    };

    WordCloudLib(canvas, options);
  }, [words, canvasHeight]); // canvasHeight가 변경될 때마다 워드 클라우드를 다시 그림

  const addInitialWord = () => {
    const newWord = prompt('Enter an initial word:');
    if (newWord) {
      setInitialWords([...initialWords, newWord]);
    }
  };

  const addWord = () => {
    const newWord = prompt('Enter a new word:');
    if (newWord) {
      const frequency = 5;
      setWords([...words, [newWord, frequency]]);
      setCanvasHeight((prevHeight) => prevHeight + 3); // 단어가 추가될 때마다 캔버스 높이를 증가시킴
    }
  };

  return (
    <div style={{ textAlign: 'center' }}>
      <div style={{ marginBottom: '20px' }}>
        <button onClick={addInitialWord}>Add Initial Word</button>
        <button onClick={addWord}>Add Word</button>
      </div>
      <div style={{ position: 'relative', width: '600px', margin: '0 auto' }}>
        <canvas
          ref={canvasRef}
          width={1200} // Double the canvas width
          height={canvasHeight * 2} // 캔버스 높이를 두 배로 설정
          style={{ position: 'absolute', bottom: -350, left: 0, width: '600px', height: `${canvasHeight}px`}} // Scale down to fit the container
        />
        {initialWords.map((word, index) => (
          <div
            key={index}
            style={{
              position: 'absolute',
              left: '50%',
              bottom: `${index * 55 + -500}px`,
              transform: 'translateX(-50%) rotate(90deg)',
              transformOrigin: 'top 0',
              fontSize: '18px',
              fontFamily: 'Times, serif',
              color: 'black',
              whiteSpace: 'nowrap',
            }}
          >
            {word}
          </div>
        ))}
      </div>
    </div>
  );
}

export default WordTree;
