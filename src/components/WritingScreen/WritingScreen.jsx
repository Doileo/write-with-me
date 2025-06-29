import React, { useState, useEffect } from "react";
import styles from "./WritingScreen.module.css";
import SavedStories from "../SavedStories/SavedStories";

const DRAFT_STORAGE_KEY = "writeWithMe-draft";
const STORIES_STORAGE_KEY = "writeWithMe-stories";

const WritingScreen = () => {
  const [text, setText] = useState("");
  const [isSaved, setIsSaved] = useState(false);
  const [stories, setStories] = useState([]);

  useEffect(() => {
    const savedText = localStorage.getItem(DRAFT_STORAGE_KEY);
    if (savedText) setText(savedText);

    const savedStories = localStorage.getItem(STORIES_STORAGE_KEY);
    if (savedStories) setStories(JSON.parse(savedStories));
  }, []);

  useEffect(() => {
    const handler = setTimeout(() => {
      localStorage.setItem(DRAFT_STORAGE_KEY, text);
      setIsSaved(true);
      const timeout = setTimeout(() => setIsSaved(false), 2000);
      return () => clearTimeout(timeout);
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
    if (title === null) return;

    const newStory = {
      id: Date.now().toString(),
      title: title.trim() || "Untitled Story",
      content: text,
      dateSaved: new Date().toISOString(),
    };

    const storedStories = [...stories, newStory];
    localStorage.setItem(STORIES_STORAGE_KEY, JSON.stringify(storedStories));
    setStories(storedStories);

    alert(`Story "${newStory.title}" saved successfully!`);
    setText("");
    localStorage.removeItem(DRAFT_STORAGE_KEY);
  };

  const handleSelectStory = (story) => {
    setText(story.content);
  };

  const handleDeleteStory = (id) => {
    const filtered = stories.filter((s) => s.id !== id);
    setStories(filtered);
    localStorage.setItem(STORIES_STORAGE_KEY, JSON.stringify(filtered));
  };

  return (
    <section className={styles["writing-screen"]}>
      <div className={styles["writing-screen__container"]}>
        <div className={styles["writing-screen__left"]}>
          <div className={styles["writing-screen__intro"]}>
            <h1 className={styles["writing-screen__heading"]}>Write With Me</h1>
            <p className={styles["writing-screen__subtext"]}>
              A focused space for your thoughts, stories, and reflections.
            </p>
            <p className={styles["writing-screen__quote"]}>
              “There is no greater agony than bearing an untold story inside
              you.” – Maya Angelou
            </p>
          </div>

          <div className={styles["writing-screen__editor"]}>
            <textarea
              className={styles["editor__textarea"]}
              placeholder="Write the first line of your idea..."
              aria-label="Writing editor"
              value={text}
              onChange={(e) => setText(e.target.value)}
            />
          </div>

          {isSaved && (
            <div
              className={styles["writing-screen__status"]}
              role="status"
              aria-live="polite"
            >
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

        <SavedStories
          stories={stories}
          onSelect={handleSelectStory}
          onDelete={handleDeleteStory}
        />
      </div>
    </section>
  );
};

export default WritingScreen;
