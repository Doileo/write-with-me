import React, { useState, useEffect } from "react";
import styles from "./WritingScreen.module.css";

const DRAFT_STORAGE_KEY = "writeWithMe-draft";
const STORIES_STORAGE_KEY = "writeWithMe-stories";

const WritingScreen = () => {
  // State to hold user’s writing input
  const [text, setText] = useState("");

  // State to give short feedback that the draft has been saved
  const [isSaved, setIsSaved] = useState(false);

  // On mount, restore any saved draft to avoid data loss or start fresh
  useEffect(() => {
    const savedText = localStorage.getItem(DRAFT_STORAGE_KEY);
    if (savedText) setText(savedText);
  }, []);

  // Autosave the draft whenever the user types, but debounce it to reduce writes
  useEffect(() => {
    const handler = setTimeout(() => {
      localStorage.setItem(DRAFT_STORAGE_KEY, text);
      setIsSaved(true); // inform the user it was saved

      // hide the message after a short delay to keep the interface clean
      const timeout = setTimeout(() => setIsSaved(false), 2000);
      return () => clearTimeout(timeout);
    }, 500);

    return () => clearTimeout(handler);
  }, [text]);

  // Manual save for completed stories, with optional title and storage
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

    // Reset editor and clear draft after manual save
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

        {/* Feedback message appears briefly after autosave */}
        {isSaved && (
          <div className={styles["writing-screen__status"]}>
            ✨ Draft saved automatically
          </div>
        )}

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
