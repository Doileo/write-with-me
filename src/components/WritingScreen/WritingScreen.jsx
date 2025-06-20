import React, { useState, useEffect } from "react";
import styles from "./WritingScreen.module.css";

const STORAGE_KEY = "writeWithMe-draft";

const WritingScreen = () => {
  const [text, setText] = useState("");

  // Load saved draft from localStorage on component mount
  useEffect(() => {
    const savedText = localStorage.getItem(STORAGE_KEY);
    if (savedText) {
      setText(savedText);
    }
  }, []);

  // Save text to localStorage with debounce
  useEffect(() => {
    const handler = setTimeout(() => {
      localStorage.setItem(STORAGE_KEY, text);
    }, 500); // save after 500ms of inactivity

    return () => clearTimeout(handler);
  }, [text]);

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
            value={text}
            onChange={(e) => setText(e.target.value)}
          />
        </div>
      </div>
    </section>
  );
};

export default WritingScreen;
