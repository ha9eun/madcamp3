import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import WordCloudLib from 'wordcloud';
import html2canvas from 'html2canvas';
import { useNavigate } from 'react-router-dom';
import './WordTree.css';
import WordClick from './WordClick'; // 팝업 컴포넌트 임포트

function WordTree() {
  const [words, setWords] = useState([]);
  const [initialWords, setInitialWords] = useState([]);
  const [canvasHeight, setCanvasHeight] = useState(50);
  const [colors, setColors] = useState([]);
  const [selectedWord, setSelectedWord] = useState(null);
  const [popupVisible, setPopupVisible] = useState(false);

  const canvasRef = useRef(null);
  const captureRef = useRef(null);
  const navigate = useNavigate();

  const imageSources = [
    process.env.PUBLIC_URL + '/assets/groundbig.png',
    process.env.PUBLIC_URL + '/assets/groundbig2.png',
  ];

  const randomImageSrc = imageSources[Math.floor(Math.random() * imageSources.length)];

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/users/me/keywords`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        const data = response.data;
        const filteredData = data.filter(item => Array.isArray(item.keywords) && item.keywords.length === 3);
        const fetchedWords = filteredData.flatMap(item => item.keywords.map(keyword => [keyword, item.answer_id]));
        setWords(fetchedWords);
        const fetchedInitialWords = fetchedWords.slice(0, 3).map(item => item[0]);
        setInitialWords(fetchedInitialWords);
        setCanvasHeight(Math.sqrt(fetchedWords.length - 3) * 33);
      } catch (error) {
        if (error.response && error.response.status === 403) {
          alert("토큰이 만료되었습니다. 다시 로그인 해주세요.");
          navigate('/login');
        }
        console.error('Error fetching data:', error);
      }
    };
    fetchData();
  }, [navigate]);

  useEffect(() => {
    const fetchColors = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/users/me/colors`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        const data = response.data;
        const colorsArray = data.map(item => item.color);
        setColors(colorsArray);
      } catch (error) {
        if (error.response && error.response.status === 403) {
          alert("토큰이 만료되었습니다. 다시 로그인 해주세요.");
          navigate('/login');
        }
        console.error('Error fetching colors:', error);
      }
    };

    fetchColors();
  }, [navigate]);

  useEffect(() => {
    const canvas = canvasRef.current;

    const options = {
      list: words.map(word => [word[0], 5]),
      gridSize: 8,
      weightFactor: 6.8,
      fontFamily: 'Times, serif',
      fontStyle: 'normal',
      color: 'black',
      backgroundColor: '#fff',
      rotateRatio: 0.5,
      rotationSteps: 2,
      drawOutOfBound: false,
      shuffle: false,
      click: (item) => {
        const clickedWord = words.find(word => word[0] === item[0]);
        if (clickedWord) {
          setSelectedWord({ word: clickedWord[0], answerId: clickedWord[1] });
          setPopupVisible(true);
        }
      },
      ellipticity: 0.6,
      shape: 'circle',
    };

    WordCloudLib(canvas, options);
  }, [words, canvasHeight]);

  const generateCenterOutIndices = (length) => {
    const indices = [];
    let i = length;
    while (i > 0) {
      if (i % 2 === 0) {
        for (let j = 0; j < i / 2; j++) {
          indices.push(i - j * 2 - 1);
        }
        for (let j = 0; j < i / 2; j++) {
          indices.push(j * 2);
        }
      } else {
        for (let j = 0; j < Math.ceil(i / 2); j++) {
          indices.push(i - j * 2 - 1);
        }
        for (let j = 0; j < (i - Math.ceil(i / 2)); j++) {
          indices.push((j + 1) * 2 - 1);
        }
      }
      i -= 20;
    }
    return indices;
  };

  const generateCenterOutColors = (colors) => {
    const indices = generateCenterOutIndices(colors.length);
    return indices.map(index => colors[index]);
  };

  const centerOutColors = generateCenterOutColors(colors);

  const captureScreenshot = () => {
    if (captureRef.current) {
      html2canvas(captureRef.current, {
        useCORS: true,
        scale: 2,
        logging: true,
        scrollX: 0,
        scrollY: 0,
        windowWidth: document.documentElement.offsetWidth,
        windowHeight: document.documentElement.offsetHeight,
      }).then(canvas => {
        const link = document.createElement('a');
        link.href = canvas.toDataURL('image/png');
        link.download = 'capture.png';
        link.click();
      });
    }
  };

  return (
    <div className="wordtree-main" ref={captureRef}>
      <button onClick={captureScreenshot}>Capture</button>
      <div className="wordtree-container">
        <div style={{ textAlign: 'center', backgroundColor: '#fff', padding: '20px', display: 'inline-block', height: '450px' }}>
          <div style={{ textAlign: 'center' }}>
              {popupVisible && (
                <WordClick
                  word={selectedWord.word}
                  answerId={selectedWord.answerId}
                  onClose={() => setPopupVisible(false)}
                />
              )}
              <div style={{ position: 'relative', width: '600px', margin: '0 auto' }}>
                <canvas
                  ref={canvasRef}
                  width={1200}
                  height={canvasHeight * 2}
                  style={{ position: 'absolute', top: 50, left: 0, width: '600px', height: `${canvasHeight}px` }}
                />
                {initialWords.map((word, index) => (
                  <div
                    key={index}
                    style={{
                      position: 'absolute',
                      left: '50%',
                      top: `${index * 55 + Math.sqrt(Math.max(0, canvasHeight - 100)) * 15 + 110}px`,
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
                <img
                  src={randomImageSrc}
                  alt=''
                  style={{
                    width: '750px',
                    position: 'absolute',
                    left: '50%',
                    top: `${2 * 55 + Math.sqrt(Math.max(0, canvasHeight - 100)) * 15 + 150}px`,
                    transform: 'translateX(-50%)',
                    transformOrigin: 'top 0',
                  }}
                />
                <div
                  style={{
                    position: 'absolute',
                    left: '50%',
                    top: `${2 * 55 + Math.sqrt(Math.max(0, canvasHeight - 100)) * 15 + 165}px`,
                    transform: 'translateX(-50%)',
                    width: '560px',
                    height: 'auto',
                    display: 'flex',
                    flexWrap: 'wrap',
                    justifyContent: 'center',
                  }}
                >
                  {centerOutColors.map((color, i) => (
                    <div
                      key={i}
                      style={{
                        width: '28px',
                        height: '28px',
                        borderRadius: '8px',
                        backgroundColor: color,
                      }}
                    ></div>
                  ))}
                </div>
              </div>
            </div>
        </div>

        
      </div>
      {popupVisible && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          zIndex: 999
        }} />
      )}
    </div>
  );  
}

export default WordTree;
