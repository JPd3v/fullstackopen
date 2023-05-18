import { createContext, useReducer } from 'react';

function notificationReducer(state, action) {
  switch (action.type) {
    case 'SET_NOTIFICATION':
      return {
        text: action.payload.text,
        type: action.payload.type,
        time: action.payload.time,
      };
    case 'CLEAR_NOTIFICATION':
      return null;
    default:
      null;
  }
}

export const NotificationContext = createContext();

export default function NotificationContextProvider({ children }) {
  const [notification, dispatcher] = useReducer(notificationReducer, null);

  function handleSetNotification(text, type, time = 5000) {
    dispatcher({ type: 'SET_NOTIFICATION', payload: { text, type, time } });
  }

  function handleClearNotification() {
    dispatcher({ type: 'CLEAR_NOTIFICATION' });
  }

  return (
    <NotificationContext.Provider
      value={{
        content: notification,
        set: handleSetNotification,
        clear: handleClearNotification,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
}
