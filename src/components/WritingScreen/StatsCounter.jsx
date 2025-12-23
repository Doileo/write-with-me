import React from "react";
import styles from "./WritingScreen.module.css";

const StatsCounter = ({ wordCount, charCount, readingTime, visible }) => {
  return (
    <p
      className={`${styles["writing-screen__counter"]} ${
        visible ? styles["counter--visible"] : styles["counter--hidden"]
      }`}
      aria-live="polite"
    >
      <span>{wordCount} words</span>
      <span aria-hidden="true"> · </span>
      <span>{charCount} characters</span>
      <span aria-hidden="true"> · </span>
      <span>{readingTime} min read</span>
    </p>
  );
};

export default StatsCounter;
