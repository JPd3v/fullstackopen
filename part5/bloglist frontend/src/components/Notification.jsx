import { useEffect, useState } from "react";

/* eslint-disable react/prop-types */
export default function Notification({ message, type, handleOnDismount, time = 5000 }) {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setIsVisible(false);
      handleOnDismount();
    }, time);
  }, [time, handleOnDismount]);
  return message && isVisible ? <div className={`${type}`}>{message}</div> : null;
}
