import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';  // Import useAuth from the correct path

function TokenExpirationHandler() {
  const { isTokenExpired, setIsTokenExpired } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isTokenExpired) {
      alert('토큰이 만료되었습니다. 다시 로그인 해주세요.');
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      setIsTokenExpired(false);
      navigate('/login');
    }
  }, [isTokenExpired, navigate, setIsTokenExpired]);

  return null;
}

export default TokenExpirationHandler;
