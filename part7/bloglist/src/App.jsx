import { Routes, Route, Navigate } from 'react-router-dom';
import LogInForm from './components/logInForm';
import './App.css';
import Notification from './components/Notification';
import { useAuth, useNotificationContext } from './hooks';
import Users from './components/Users';
import User from './components/User';
import BlogPage from './components/BlogPage';
import BlogsPage from './components/BlogsPage';
import NavBar from './components/NavBar';

const App = () => {
  const { user } = useAuth();

  const notification = useNotificationContext();

  return (
    <div>
      {notification.content && <Notification />}
      {!user && <LogInForm />}
      <NavBar />

      {user ? (
        <Routes>
          <Route path="/users" element={<Users />} />
          <Route path="/users/:id" element={<User />} />
          <Route path="/blogs/" element={<BlogsPage />} />
          <Route path="/blogs/:id" element={<BlogPage />} />
        </Routes>
      ) : (
        <Navigate replace to={'/'} />
      )}
    </div>
  );
};

export default App;
