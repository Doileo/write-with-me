import React from "react";
import styles from "./WritingScreen.module.css";

const StatsCounter = ({ wordCount, charCount, readingTime }) => {
  return (
    // ✅ Changed <div> to <p> for better semantics.
    // Using <p> makes this text easier for assistive technologies to interpret as descriptive text, not just layout.
    <p className={styles["writing-screen__counter"]}>
      <span>{wordCount} words</span>
      {/* ✅ Added aria-hidden="true" so screen readers skip the decorative separator.
          Without this, it would be read aloud as "dot", which sounds awkward. */}
      <span aria-hidden="true"> · </span>

      <span>{charCount} characters</span>
      <span aria-hidden="true"> · </span>

      <span>{readingTime} min read</span>
    </p>
  );
};

export default StatsCounter;
