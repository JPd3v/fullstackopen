import { useEffect, useReducer } from 'react';
import { createContext } from 'react';
import blogService from '../services/blogs.js';
import { logIn } from '../services/auth';
import { useNotificationContext } from '../hooks';

export const AuthContext = createContext();

function authReducer(state, action) {
  switch (action.type) {
    case 'LOG_IN':
      return action.payload;
    case 'LOG_OUT':
      return null;
    default:
      null;
  }
}

export default function AuthContextProvider({ children }) {
  const [user, dispatch] = useReducer(authReducer, null);
  const notification = useNotificationContext();
  console.log(user);
  useEffect(() => {
    const logedUser = window.localStorage.getItem('logedInUser');
    if (logedUser) {
      const user = JSON.parse(logedUser);
      dispatch({ type: 'LOG_IN', payload: user });
      blogService.setToken(user.token);
    }
  }, []);

  async function handleLogIn(username, password) {
    try {
      const response = await logIn(username, password);
      const userJson = JSON.stringify(response);
      window.localStorage.setItem('logedInUser', userJson);
      dispatch({ type: 'LOG_IN', payload: response });
      blogService.setToken(response.token);
    } catch (error) {
      notification.set(error.response.data.error, 'error');
    }
  }

  function handleLogOut() {
    window.localStorage.removeItem('logedInUser');
    blogService.setToken(null);

    dispatch({ type: 'LOG_OUT' });
  }

  return (
    <AuthContext.Provider
      value={{ user, logIn: handleLogIn, logOut: handleLogOut }}
    >
      {children}
    </AuthContext.Provider>
  );
}
