import React, { useState, useEffect } from 'react';
import axios from 'axios';
import CryptoJS from 'crypto-js';
import { useNavigate } from 'react-router-dom';
import './Profile.css';

function Profile() {
  const [userInfo, setUserInfo] = useState({
    user_id: '',
    password: '',
    nickname: ''
  });
  const [isEditing, setIsEditing] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem('token');
        console.log('token is:', token);
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/users/me/keywords`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        setUserInfo(response.data);
      } catch (error) {
        if (error.response.status === 403) {
          alert("토큰이 만료되었습니다. 다시 로그인 해주세요.");
          navigate('/login');
        }
        console.error('Error fetching user data:', error);
      }
    };
    fetchUser();
  }, [navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserInfo({
      ...userInfo,
      [name]: value
    });
  };

  const handlePasswordChange = (e) => {
    if (e.target.name === 'currentPassword') {
      setCurrentPassword(e.target.value);
    } else {
      setNewPassword(e.target.value);
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/users/me`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      const currentUser = response.data;
      const hashedCurrentPassword = CryptoJS.SHA256(currentPassword).toString();

      if (currentUser.password !== hashedCurrentPassword) {
        setPasswordError('Current password is incorrect.');
        return;
      }

      const updatedUser = {
        ...currentUser,
        password: newPassword ? CryptoJS.SHA256(newPassword).toString() : currentUser.password,
        nickname: userInfo.nickname
      };

      await axios.put(`${process.env.REACT_APP_API_URL}/users/me`, updatedUser, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      alert('Profile updated successfully!');
      setIsEditing(false);
      setCurrentPassword('');
      setNewPassword('');
      setPasswordError('');
    } catch (error) {
      if (error.response.status === 403) {
        alert("토큰이 만료되었습니다. 다시 로그인 해주세요.");
        navigate('/login');
      }
      console.error('Error updating profile:', error);
    }
  };

  return (
    <div className="profile-wrapper">
      <div className="profile-container">
        <h2>프로필</h2>
        {isEditing ? (
          <form onSubmit={handleSave} className="profile-form">
            <div className="form-group">
              <label>ID</label>
              <span>{userInfo.user_id}</span>
            </div>
            <div className="form-group">
              <label>현재 비밀번호</label>
              <input
                type="password"
                name="currentPassword"
                value={currentPassword}
                onChange={handlePasswordChange}
              />
              {passwordError && <span className="error-message">{passwordError}</span>}
            </div>
            <div className="form-group">
              <label>새로운 비밀번호</label>
              <input
                type="password"
                name="newPassword"
                value={newPassword}
                onChange={handlePasswordChange}
              />
            </div>
            <div className="form-group">
              <label>닉네임</label>
              <input
                type="text"
                name="nickname"
                value={userInfo.nickname}
                onChange={handleChange}
              />
            </div>
            <div className="button-group">
              <button type="submit" className="btn btn-save">저장</button>
              <button type="button" className="btn btn-cancel" onClick={() => setIsEditing(false)}>취소</button>
            </div>
          </form>
        ) : (
          <div className="profile-view">
            <div className="form-group">
              <label>ID</label>
              <span>{userInfo.user_id}</span>
            </div>
            <div className="form-group">
              <label>닉네임</label>
              <span>{userInfo.nickname}</span>
            </div>
            <button className="btn btn-edit" onClick={() => setIsEditing(true)}>수정</button>
          </div>
        )}
      </div>
    </div>
  );
}

export default Profile;
