// File: ThinkingDots.jsx
import React from "react";
import styles from "./ThinkingDots.module.css";

const ThinkingDots = () => {
  return (
    <span
      className={styles["thinking-dots"]}
      role="status"
      aria-label="Thinking"
    >
      <span className={styles.dot} />
      <span className={styles.dot} />
      <span className={styles.dot} />
    </span>
  );
};

export default ThinkingDots;
