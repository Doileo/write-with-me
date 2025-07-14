import React, { useEffect } from "react";
import styles from "./Toast.module.css";

const Toast = ({ message, onClose, duration = 3000 }) => {
  useEffect(() => {
    const timer = setTimeout(onClose, duration);
    return () => clearTimeout(timer);
  }, [onClose, duration]);

  if (!message) return null;

  return (
    <div className={styles.toast} role="status" aria-live="polite">
      {message}
    </div>
  );
};

export default Toast;
