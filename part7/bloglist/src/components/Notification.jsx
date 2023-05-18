import { useEffect } from 'react';
import { useNotificationContext } from '../hooks';

export default function Notification() {
  const { content, clear } = useNotificationContext();
  const { time, type, text } = content;

  useEffect(() => {
    setTimeout(() => {
      clear();
    }, time);
  }, [time, clear]);

  return text ? <div className={`${type}`}>{text}</div> : null;
}
