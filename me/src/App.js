import React from 'react';
import { BrowserRouter as Router, Route, Routes, useLocation, Navigate } from 'react-router-dom';
import { AnswerProvider } from './context/AnswerContext';
import Login from './components/Login/Login';
import Signup from './components/Signup/Signup';
import Main from './components/Main/Main';
import Questions from './components/Questions/Questions';
import PostAnswer from './components/Questions/PostAnswer';
import WordTree from './components/WordTree/WordTree';
import Profile from './components/Profile/Profile';
import Navbar from './components/Navbar';
import Social from './components/Social/Social';
import './App.css';
import ViewAnswer from './components/Questions/ViewAnswer';
import FriendPage from './components/Social/FriendPage';

function PrivateRoute({ component: Component }) {
  const currentUser = JSON.parse(localStorage.getItem('currentUser'));
  return currentUser ? <Component /> : <Navigate to="/login" />;
}

function App() {
  const location = useLocation();
  const hideNavbarPaths = ['/login', '/signup'];

  return (
    <div className="App">
      {!hideNavbarPaths.includes(location.pathname) && <Navbar />}
      <div className="app-main">
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/" element={<PrivateRoute component={Main} />} />
          <Route path="/questions" element={<PrivateRoute component={Questions} />} />
          <Route path="/postanswer" element={<PrivateRoute component={PostAnswer} />} />
          <Route path="/wordtree" element={<PrivateRoute component={WordTree} />} />
          <Route path="/social" element={<PrivateRoute component={Social} />} />
          <Route path="/profile" element={<PrivateRoute component={Profile} />} />
          <Route path="/viewanswer/:answer_id" element={<PrivateRoute component={ViewAnswer} />} />
          <Route path="/friend/:friendId" element={<FriendPage />} />
        </Routes>
      </div>
    </div>
  );
}

function AppWrapper() {
  return (
    <AnswerProvider>
      <Router>
        <App />
      </Router>
    </AnswerProvider>
  );
}

export default AppWrapper;
