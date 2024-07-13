import React, { useState, useEffect, useRef } from 'react';

const initialWords = [];

function TreeWordCloud() {
  const [words, setWords] = useState(initialWords);
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');
    const scale = window.devicePixelRatio; // 장치 픽셀 비율

    // 캔버스 크기 조정
    canvas.width = 1200 * scale; // 픽셀 해상도
    canvas.height = 1600 * scale; // 픽셀 해상도
    canvas.style.width = '600px'; // 화면에 보이는 크기
    canvas.style.height = '800px'; // 화면에 보이는 크기
    context.scale(scale, scale);

    context.clearRect(0, 0, canvas.width, canvas.height);

    // 캔버스 중앙 계산
    const centerX = canvas.width / 2 / scale;
    const centerY = canvas.height / 2 / scale;

    // 단어 시작점과 각도 리스트
    const wordPositions = [
      { x: centerX, y: centerY, angle: 90 },
      { x: centerX, y: centerY - 70, angle: 90 },
      { x: centerX, y: centerY - 140, angle: 90 },

      { x: centerX - 30, y: centerY - 150, angle: 210 },
      { x: centerX, y: centerY - 160, angle: 250 },
      { x: centerX + 30, y: centerY - 155, angle: 290 },
      { x: centerX + 60, y: centerY - 140, angle: 330 },

      { x: centerX - 30, y: centerY - 180, angle: 230 },
      { x: centerX + 15, y: centerY - 190, angle: 270 },
      { x: centerX + 60, y: centerY - 170, angle: 310 },

      { x: centerX - 80, y: centerY - 200, angle: 210 },
      { x: centerX - 20, y: centerY - 230, angle: 240 },
      { x: centerX + 45, y: centerY - 225, angle: 300 },
      { x: centerX + 105, y: centerY - 190, angle: 330 },

      { x: centerX - 80, y: centerY - 235, angle: 215 },
      { x: centerX - 60, y: centerY - 250, angle: 235 },
      { x: centerX - 0, y: centerY - 260, angle: 250 },
      { x: centerX + 30, y: centerY - 255, angle: 290 },
      { x: centerX + 140, y: centerY - 360, angle: 30 },
    ];

    const drawText = (text, x, y, angle) => {
      context.save();
      context.translate(x, y);
      context.rotate((angle * Math.PI) / 180);
      context.fillText(text, 0, 0);
      context.restore();
    };

    words.forEach((word, index) => {
      const fontSize = 20; // 고정된 폰트 크기
      context.font = `${fontSize}px Times, serif`;
      context.fillStyle = 'black';

      if (index < wordPositions.length) {
        const position = wordPositions[index];
        drawText(word[0], position.x, position.y, position.angle);
      }
    });
  }, [words]);

  const addWord = () => {
    const newWord = prompt('Enter a new word:');
    if (newWord) {
      setWords([...words, [newWord]]);
    }
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
      <div style={{ position: 'relative', width: '600px', height: '600px', border: '2px solid black' }}>
        <button onClick={addWord} style={{ position: 'absolute', top: '10px', left: '10px', zIndex: 1 }}>Add Word</button>
        <canvas ref={canvasRef} style={{ position: 'absolute', top: '0', left: '0' }} />
      </div>
    </div>
  );
}

export default TreeWordCloud;
