import React from "react";
import { Sparkles } from "lucide-react";
import styles from "./WritingScreen.module.css";

const StreakCounter = ({ daysShownUp, sparkleTrigger }) => {
  return (
    <div className={styles["writing-screen__streak"]}>
      <Sparkles
        size={18}
        className={sparkleTrigger ? styles["sparkle-animate"] : ""}
      />
      Days you’ve shown up: {daysShownUp}
    </div>
  );
};

export default StreakCounter;
