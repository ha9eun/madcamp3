import React, { useState, useEffect } from 'react';
import axios from 'axios';
import CryptoJS from 'crypto-js';
import { useNavigate } from 'react-router-dom';

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
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/users/me`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        setUserInfo(response.data);
      } catch (error) {
        if (error.response.status === 403) {
          alert("세션이 만료되었습니다. 다시 로그인 해주세요.");
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
        alert("세션이 만료되었습니다. 다시 로그인 해주세요.");
        navigate('/login');
      }
      console.error('Error updating profile:', error);
    }
  };

  return (
    <div>
      <h2>Profile</h2>
      {isEditing ? (
        <form onSubmit={handleSave}>
          <div>
            <label>User ID: </label>
            <span>{userInfo.user_id}</span>
          </div>
          <div>
            <label>Current Password: </label>
            <input
              type="password"
              name="currentPassword"
              value={currentPassword}
              onChange={handlePasswordChange}
            />
            {passwordError && <span style={{ color: 'red' }}>{passwordError}</span>}
          </div>
          <div>
            <label>New Password: </label>
            <input
              type="password"
              name="newPassword"
              value={newPassword}
              onChange={handlePasswordChange}
            />
          </div>
          <div>
            <label>Nickname: </label>
            <input
              type="text"
              name="nickname"
              value={userInfo.nickname}
              onChange={handleChange}
            />
          </div>
          <button type="submit">Save</button>
          <button type="button" onClick={() => setIsEditing(false)}>Cancel</button>
        </form>
      ) : (
        <div>
          <div>
            <label>User ID: </label>
            <span>{userInfo.user_id}</span>
          </div>
          <div>
            <label>Nickname: </label>
            <span>{userInfo.nickname}</span>
          </div>
          <button onClick={() => setIsEditing(true)}>Edit</button>
        </div>
      )}
    </div>
  );
}

export default Profile;
