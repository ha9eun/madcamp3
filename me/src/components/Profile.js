import React, { useState, useEffect } from 'react';
import CryptoJS from 'crypto-js';

function Profile() {
  const [userInfo, setUserInfo] = useState({
    username: '',
    password: '',
    nickname: ''
  });
  const [isEditing, setIsEditing] = useState(false);
  const [usernameError, setUsernameError] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');

  useEffect(() => {
    const users = JSON.parse(localStorage.getItem('users')) || [];
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (currentUser) {
      const user = users.find(user => user.username === currentUser.username);
      if (user) {
        setUserInfo(user);
      }
    }
  }, []);

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

  const handleSave = (e) => {
    e.preventDefault();
    const users = JSON.parse(localStorage.getItem('users')) || [];
    const currentUser = users.find(user => user.username === userInfo.username);
    const hashedCurrentPassword = CryptoJS.SHA256(currentPassword).toString();

    if (currentUser.password !== hashedCurrentPassword) {
      setPasswordError('Current password is incorrect.');
      return;
    }

    const updatedUsers = users.map(user => 
      user.username === userInfo.username
        ? { ...user, password: newPassword ? CryptoJS.SHA256(newPassword).toString() : user.password, nickname: userInfo.nickname }
        : user
    );

    localStorage.setItem('users', JSON.stringify(updatedUsers));
    alert('Profile updated successfully!');
    setIsEditing(false);
    setCurrentPassword('');
    setNewPassword('');
    setPasswordError('');
  };

  const checkUsernameAvailability = () => {
    const users = JSON.parse(localStorage.getItem('users')) || [];
    const isUsernameTaken = users.some(user => user.username === userInfo.username && user.username !== JSON.parse(localStorage.getItem('currentUser')).username);
    if (isUsernameTaken) {
      setUsernameError('Username is already taken.');
    } else {
      setUsernameError('');
    }
  };

  return (
    <div>
      <h2>Profile</h2>
      {isEditing ? (
        <form onSubmit={handleSave}>
          <div>
            <label>Username: </label>
            <input
              type="text"
              name="username"
              value={userInfo.username}
              onChange={handleChange}
              onBlur={checkUsernameAvailability}
            />
            {usernameError && <span style={{ color: 'red' }}>{usernameError}</span>}
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
          <button type="submit" disabled={usernameError}>Save</button>
          <button type="button" onClick={() => setIsEditing(false)}>Cancel</button>
        </form>
      ) : (
        <div>
          <div>
            <label>Username: </label>
            <span>{userInfo.username}</span>
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
