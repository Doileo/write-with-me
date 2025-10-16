import React, { useEffect, useRef } from "react";
import styles from "./Toast.module.css";

const Toast = ({ message, onClose, duration = 3000, type = "info" }) => {
  // keeping a ref so we can focus the toast when it appears for accessibility feedback
  const toastRef = useRef(null);

  useEffect(() => {
    // start the auto-dismiss timer when a new toast appears
    const timer = setTimeout(onClose, duration);

    // focusing toast ensures that assistive tech announces it without user intervention
    toastRef.current?.focus();

    // cleanup — ensures no memory leaks if component unmounts before timeout finishes
    return () => clearTimeout(timer);
  }, [onClose, duration]);

  // nothing to show when message is empty — keeps DOM clean
  if (typeof message !== "string" || !message.trim()) return null;

  return (
    <div
      ref={toastRef}
      // combining base and type styles for flexible visual feedback
      className={`${styles.toast} ${styles[`toast--${type}`]}`}
      role="status" // announces dynamic status updates politely
      aria-live="polite"
      aria-atomic="true"
      tabIndex="-1" // makes it focusable without altering tab order
    >
      {/* showing message first for immediate context when toast is announced */}
      <span>{message}</span>

      {/* close button gives users control; using accessible label instead of visible text */}
      <button
        onClick={onClose}
        className={styles.closeButton}
        aria-label="Close notification"
      >
        ×
      </button>
    </div>
  );
};

export default Toast;
