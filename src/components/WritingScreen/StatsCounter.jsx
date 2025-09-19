import React from "react";
import styles from "./WritingScreen.module.css";

const StatsCounter = ({ wordCount, charCount, readingTime }) => {
  return (
    <div className={styles["writing-screen__counter"]}>
      <span>{wordCount} words</span> · <span>{charCount} characters</span> ·{" "}
      <span>{readingTime} min read</span>
    </div>
  );
};

export default StatsCounter;
