import React, { useState, useEffect } from "react";
import styles from "./WritingScreen.module.css";

const DRAFT_STORAGE_KEY = "writeWithMe-draft";
const STORIES_STORAGE_KEY = "writeWithMe-stories";

const WritingScreen = () => {
  const [text, setText] = useState("");

  // Load saved draft on mount
  useEffect(() => {
    const savedText = localStorage.getItem(DRAFT_STORAGE_KEY);
    if (savedText) setText(savedText);
  }, []);

  // Autosave draft with debounce
  useEffect(() => {
    const handler = setTimeout(() => {
      localStorage.setItem(DRAFT_STORAGE_KEY, text);
    }, 500);

    return () => clearTimeout(handler);
  }, [text]);

  const saveStory = () => {
    if (!text.trim()) {
      alert("Cannot save an empty story. Please write something first.");
      return;
    }

    const title = window.prompt(
      "Enter a title for your story:",
      "Untitled Story"
    );
    if (title === null) return; // user cancelled

    const newStory = {
      id: Date.now().toString(),
      title: title.trim() || "Untitled Story",
      content: text,
      dateSaved: new Date().toISOString(),
    };

    const storedStories =
      JSON.parse(localStorage.getItem(STORIES_STORAGE_KEY)) || [];
    storedStories.push(newStory);
    localStorage.setItem(STORIES_STORAGE_KEY, JSON.stringify(storedStories));

    alert(`Story "${newStory.title}" saved successfully!`);

    // Clear editor and draft storage after save
    setText("");
    localStorage.removeItem(DRAFT_STORAGE_KEY);
  };

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

        <button
          className={styles["save-button"]}
          type="button"
          onClick={saveStory}
        >
          Save Story
        </button>
      </div>
    </section>
  );
};

export default WritingScreen;
