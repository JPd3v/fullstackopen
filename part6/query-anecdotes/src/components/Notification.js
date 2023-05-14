import { useEffect } from "react";
import {
  useDispatchNotification,
  useNotification,
} from "../contexts/NotificationContext";

const Notification = () => {
  const notification = useNotification();
  const dispatchNotification = useDispatchNotification();
  const style = {
    border: "solid",
    padding: 10,
    borderWidth: 1,
    marginBottom: 5,
  };

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      dispatchNotification({ type: "CLEAR_NOTIFICATION" });
    }, 5000);
    return () => clearTimeout(timeoutId);
  });

  if (!notification) return null;

  return <div style={style}>{notification}</div>;
};

export default Notification;
