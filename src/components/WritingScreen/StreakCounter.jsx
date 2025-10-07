import React from "react";
import { Sparkles } from "lucide-react";
import styles from "./WritingScreen.module.css";

const StreakCounter = ({ daysShownUp, sparkleTrigger }) => {
  return (
    <p className={styles["writing-screen__streak"]}>
      {/* Decorative sparkle */}
      <Sparkles
        size={18}
        className={sparkleTrigger ? styles["sparkle-animate"] : ""}
        aria-hidden="true" // hides animation from screen readers
      />
      {/* Main streak text */}
      <strong>{daysShownUp}</strong> day{daysShownUp !== 1 ? "s" : ""} you've
      shown up
      {/* Screen-reader live region */}
      {sparkleTrigger && (
        <span className="visually-hidden" aria-live="polite">
          {" "}
          Congratulations! Your streak has increased!
        </span>
      )}
    </p>
  );
};

export default StreakCounter;
