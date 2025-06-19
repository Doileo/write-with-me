import React from "react";
import styles from "./WritingScreen.module.css";

const WritingScreen = () => {
  return (
    <section className={styles["writing-screen"]}>
      <div className="container">
        <h1 className={styles["writing-screen__heading"]}>Write With Me</h1>
        <p className={styles["writing-screen__subtext"]}>
          A focused space for your thoughts, stories, and reflections.
        </p>

        <div className={styles["writing-screen__editor"]}>
          <textarea
            className={styles["editor__textarea"]}
            placeholder="Start writing your story here..."
            aria-label="Writing editor"
          />
        </div>
      </div>
    </section>
  );
};

export default WritingScreen;
