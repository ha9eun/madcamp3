import React, { createContext, useState, useContext, useEffect } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isTokenExpired, setIsTokenExpired] = useState(false);

  const checkTokenExpiration = () => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      const { exp } = JSON.parse(atob(token.split('.')[1]));
      const expirationTime = exp * 1000 - 60000; // 1분 전
      if (Date.now() >= expirationTime) {
        setIsTokenExpired(true);
      }
    }
  };

  useEffect(() => {
    const interval = setInterval(checkTokenExpiration, 60000); // 1분마다 체크
    return () => clearInterval(interval);
  }, []);

  return (
    <AuthContext.Provider value={{ isTokenExpired, setIsTokenExpired }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
