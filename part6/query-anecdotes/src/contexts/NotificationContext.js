import { createContext, useContext, useReducer } from "react";

function notificationReducer(state, action) {
  switch (action.type) {
    case "SET_NOTIFICATION":
      return action.payload;
    case "CLEAR_NOTIFICATION":
      return "";
    default:
      return "";
  }
}

const NotificationContext = createContext();

export default function NotificationContextProvider({ children }) {
  const [notification, notificationDispatch] = useReducer(notificationReducer, "");

  return (
    <NotificationContext.Provider value={[notification, notificationDispatch]}>
      {children}
    </NotificationContext.Provider>
  );
}

export function useNotification() {
  const context = useContext(NotificationContext);
  return context[0];
}

export function useDispatchNotification() {
  const context = useContext(NotificationContext);
  return context[1];
}
