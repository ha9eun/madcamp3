import React, { useState, useEffect, useContext } from 'react';
import Calendar from 'react-calendar';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import 'react-calendar/dist/Calendar.css';
import './CalendarSetting.css';
import { AnswerContext } from '../../context/AnswerContext';

function MyCalendar() {
  const [date, setDate] = useState(new Date());
  const { answers, setAnswers, setSelectedAnswerId } = useContext(AnswerContext);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchColors = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/users/me/colors`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        const colorsData = response.data.reduce((acc, item) => {
          const date = new Date(item.date);
          const dateString = new Date(date.getTime() + date.getTimezoneOffset() * 60000).toISOString().split('T')[0];
          acc[dateString] = { color: item.color, answer_id: item.answer_id };
          return acc;
        }, {});
        setAnswers(colorsData);
      } catch (error) {
        if (error.response.status === 403) {
          alert("세션이 만료되었습니다. 다시 로그인 해주세요.");
          navigate('/login');
        }
        console.error('Error fetching colors:', error);
      }
    };

    fetchColors();
  }, [setAnswers, navigate]);

  const onDateClick = (date) => {
    const dateString = date.toISOString().split('T')[0];
    if (answers[dateString]) {
      setSelectedAnswerId(answers[dateString].answer_id);
    } else {
      setSelectedAnswerId(null);
    }
  };

  const tileClassName = ({ date, view }) => {
    if (view === 'month') {
      const dateString = date.toISOString().split('T')[0];
      return answers[dateString]?.color ? 'custom-tile' : null;
    }
    return null;
  };

  const tileContent = ({ date, view }) => {
    if (view === 'month') {
      const dateString = date.toISOString().split('T')[0];
      const backgroundColor = answers[dateString]?.color;
      if (backgroundColor) {
        return (
          <div
            className="tile-content"
            style={{ backgroundColor }}
          />
        );
      }
    }
    return null;
  };

  return (
    <div className="calendar-box">
      <div>
        <Calendar
          onChange={setDate}
          value={date}
          onClickDay={onDateClick}
          formatDay={(_locale, date) => date.getDate().toString()}
          tileClassName={tileClassName}
          tileContent={tileContent}
        />
      </div>
    </div>
  );
}

export default MyCalendar;
