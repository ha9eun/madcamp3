import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import WordCloudLib from 'wordcloud';
import { useNavigate } from 'react-router-dom';

function WordTree() {
  const [words, setWords] = useState([]);
  const [initialWords, setInitialWords] = useState([]);
  const [canvasHeight, setCanvasHeight] = useState(50); // 초기 캔버스 높이 설정
  const [colors, setColors] = useState([]);
  // const [colors, setColors] = useState(['#ff0000', '#00ff00', '#0000ff', '#ffff00', '#ff00ff', '#00ffff', '#ff0000', '#00ff00', '#0000ff', '#ffff00', '#ff00ff', '#00ffff', '#ff0000', '#00ff00', '#0000ff', '#ffff00', '#ff00ff', '#00ffff', '#ff0000', '#00ff00', '#0000ff', '#ffff00', '#ff00ff', '#00ffff', '#ff0000', '#00ff00', '#0000ff', '#ffff00', '#ff00ff', '#00ffff', '#ff0000', '#00ff00', '#0000ff', '#ffff00', '#ff00ff', '#00ffff']); // 예시 색상 목록
  // const [colors, setColors] = useState(['#ff0000', '#00ff00', '#0000ff', '#ffff00', '#ff00ff', '#00ffff']);
  // const [colors, setColors] = useState(['#ff0000', '#00ff00', '#0000ff', '#ffff00', '#ff00ff', '#00ffff', '#ff0000', '#00ff00', '#0000ff', '#ffff00', '#ff00ff', '#00ffff']);
  const canvasRef = useRef(null);
  const navigate = useNavigate();

  const imageSources = [
    process.env.PUBLIC_URL + '/assets/groundbig.png',
    process.env.PUBLIC_URL + '/assets/groundbig2.png',
    // 다른 이미지 경로들을 추가하세요
  ];

  // 랜덤 이미지 소스를 선택
  const randomImageSrc = imageSources[Math.floor(Math.random() * imageSources.length)];


  useEffect(() => {
    // 서버에서 단어 데이터를 불러옴
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/users/me/keywords`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        const data = response.data;

        // keywords 배열의 길이가 3인 항목들만 필터링
        const filteredData = data.filter(item => Array.isArray(item.keywords) && item.keywords.length === 3);

        // 필터링된 데이터에서 키워드 값을 추출하여 단어 목록 생성
        // const tempWords = [['하얀색', 5], ['산책', 5], ['커피', 5], ['독서', 5], ['음악', 5], ['운동', 5], ['요리', 5], ['영화', 5], ['공원', 5], ['친구', 5], ['가족', 5], ['여행', 5], ['수영', 5], ['쇼핑', 5], ['저녁', 5], ['아침', 5], ['점심', 5], ['잠', 5], ['게임', 5], ['산책로', 5], ['바다', 5], ['산', 5], ['하늘', 5], ['꽃', 5], ['도서관', 5], ['카페', 5], ['운전', 5], ['산책길', 5], ['영화관', 5], ['음식', 5], ['하얀색', 5], ['산책', 5], ['커피', 5], ['독서', 5], ['음악', 5], ['운동', 5], ['요리', 5], ['영화', 5], ['공원', 5], ['친구', 5], ['가족', 5], ['여행', 5], ['수영', 5], ['쇼핑', 5], ['저녁', 5], ['아침', 5], ['점심', 5], ['잠', 5], ['게임', 5], ['산책로', 5], ['바다', 5], ['산', 5], ['하늘', 5], ['꽃', 5], ['도서관', 5], ['카페', 5], ['운전', 5], ['산책길', 5], ['영화관', 5], ['음식', 5], ['하얀색', 5], ['산책', 5], ['커피', 5], ['독서', 5], ['음악', 5], ['운동', 5], ['요리', 5], ['영화', 5], ['공원', 5], ['친구', 5], ['가족', 5], ['여행', 5], ['수영', 5], ['쇼핑', 5], ['저녁', 5], ['아침', 5], ['점심', 5], ['잠', 5], ['게임', 5], ['산책로', 5], ['바다', 5], ['산', 5], ['하늘', 5], ['꽃', 5], ['도서관', 5], ['카페', 5], ['운전', 5], ['산책길', 5], ['영화관', 5], ['음식', 5], ['하얀색', 5], ['산책', 5], ['커피', 5], ['독서', 5], ['음악', 5], ['운동', 5], ['요리', 5], ['영화', 5], ['공원', 5], ['친구', 5], ['가족', 5], ['여행', 5], ['수영', 5], ['쇼핑', 5], ['저녁', 5], ['아침', 5], ['점심', 5], ['잠', 5], ['게임', 5], ['산책로', 5], ['바다', 5], ['산', 5], ['하늘', 5], ['꽃', 5], ['도서관', 5], ['카페', 5], ['운전', 5], ['산책길', 5], ['영화관', 5], ['음식', 5]];
        const tempWords = [['하얀색', 5], ['산책', 5], ['커피', 5], ['독서', 5], ['음악', 5], ['운동', 5], ['요리', 5], ['영화', 5], ['공원', 5], ['친구', 5], ['가족', 5], ['여행', 5], ['수영', 5], ['쇼핑', 5], ['저녁', 5], ['아침', 5], ['점심', 5], ['잠', 5], ['게임', 5], ['산책로', 5], ['바다', 5], ['산', 5], ['하늘', 5], ['꽃', 5], ['도서관', 5], ['카페', 5], ['운전', 5], ['산책길', 5], ['영화관', 5], ['음식', 5], ['하얀색', 5], ['산책', 5], ['커피', 5], ['독서', 5], ['음악', 5], ['운동', 5], ['요리', 5], ['영화', 5], ['공원', 5], ['친구', 5], ['가족', 5], ['여행', 5], ['수영', 5], ['쇼핑', 5], ['저녁', 5], ['아침', 5], ['점심', 5], ['잠', 5], ['게임', 5], ['산책로', 5], ['바다', 5], ['산', 5], ['하늘', 5], ['꽃', 5], ['도서관', 5], ['카페', 5], ['운전', 5], ['산책길', 5], ['영화관', 5], ['음식', 5]];
        // const tempWords = [['하얀색', 5], ['산책', 5], ['커피', 5], ['독서', 5], ['음악', 5], ['운동', 5]];
        const fetchedWords = filteredData.flatMap(item => item.keywords.map(keyword => [keyword, 5]));
        // setWords(tempWords);
        setWords(fetchedWords);

        // fetchedWords에서 처음 3개의 단어만 initialWords에 넣음
        const fetchedInitialWords = fetchedWords.slice(0, 3).map(item => item[0]);
        setInitialWords(fetchedInitialWords);

        // 캔버스 높이를 단어 수에 따라 동적으로 설정
        setCanvasHeight(Math.sqrt(fetchedWords.length-3) * 33);
        // setCanvasHeight(Math.sqrt(tempWords.length-3) * 33);
      } catch (error) {
        if (error.response && error.response.status === 403) {
          alert("토큰이 만료되었습니다. 다시 로그인 해주세요.");
          navigate('/login');
        }
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, [navigate]); // 컴포넌트가 마운트될 때 한 번 실행

  useEffect(() => {
    //색 불러오기
    const fetchColors = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/users/me/colors`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        const data = response.data;
        console.log(data);

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
    // console.log(tempWords);

    const options = {
      list: words,
      // lsit: tempWords,
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

  // 중앙에서부터 양쪽으로 하나씩 추가하는 인덱스 순서를 생성
  const generateCenterOutIndices = (length) => {
    const indices = [];
    let i = length;
    while (i > 0) {
        if (i%2 === 0) {                  //색깔 짝수개
          for (let j = 0; j<i/2; j++) {
            indices.push(i - j*2 -1);
          }
          for (let j = 0; j<i/2; j++) {
            indices.push(j*2);
          }
        }
        else if (i%2 === 1) {             //색깔 홀수개
          for (let j = 0; j<Math.ceil(i/2); j++) {
            indices.push(i - j*2-1);
          }
          for (let j = 0; j<(i-Math.ceil(i/2)); j++) {
            indices.push((j+1)*2-1);
          }
        }
      i -= 20;
      console.log('i equals: ', i);
    }
    return indices;
  };

  const generateCenterOutColors = (colors) => {
    const indices = generateCenterOutIndices(colors.length);
    console.log(indices);
    return indices.map(index => colors[index]);
  };

  const centerOutColors = generateCenterOutColors(colors);

  return (
    <div style={{ textAlign: 'center' }}>
      <div style={{ position: 'relative', width: '600px', margin: '0 auto' }}>
        <canvas
          ref={canvasRef}
          width={1200} // Double the canvas width
          height={canvasHeight * 2} // 캔버스 높이를 두 배로 설정
          style={{ position: 'absolute', top: 50, left: 0, width: '600px', height: `${canvasHeight}px`}} // Scale down to fit the container
        />
        {initialWords.map((word, index) => (
          <div
            key={index}
            style={{
              position: 'absolute',
              left: '50%',
              // top: `${index * 55 + 290}px`,
              top: `${index * 55 + Math.sqrt(Math.max(0, canvasHeight-100)) * 15 + 110}px`,
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
            top: `${2 * 55 + Math.sqrt(Math.max(0, canvasHeight-100)) * 15 + 150}px`,
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
            // display: 'grid',
            // gridTemplateColumns: 'repeat(20, 28px)',
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
  );
}

export default WordTree;
