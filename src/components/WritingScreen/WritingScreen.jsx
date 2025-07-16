import React, { useState, useEffect } from "react";
import styles from "./WritingScreen.module.css";
import SavedStories from "../SavedStories/SavedStories";
import ThinkingDots from "./ThinkingDots";
import QuoteOfTheDay from "./QuoteOfTheDay";
import Toast from "./Toast";
import { getAISuggestion } from "../../api/openai";
import { Sparkles, CheckCircle, XCircle, Save } from "lucide-react";

const DRAFT_STORAGE_KEY = "writeWithMe-draft";
const STORIES_STORAGE_KEY = "writeWithMe-stories";

const WritingScreen = () => {
  const [text, setText] = useState("");
  const [isSaved, setIsSaved] = useState(false);
  const [stories, setStories] = useState([]);
  const [suggestion, setSuggestion] = useState("");
  const [loadingSuggestion, setLoadingSuggestion] = useState(false);
  const [error, setError] = useState(null);
  const [toastMessage, setToastMessage] = useState("");

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
      setToastMessage("❗ Please write something before saving.");
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

    setText("");
    localStorage.removeItem(DRAFT_STORAGE_KEY);
    setToastMessage(`✅ "${newStory.title}" saved successfully!`);
  };

  const handleSuggestClick = async () => {
    if (!text.trim()) {
      setError("Please write something before asking for a suggestion.");
      return;
    }

    setLoadingSuggestion(true);
    setError(null);
    try {
      const aiSuggestion = await getAISuggestion(text);
      setSuggestion(aiSuggestion);
    } catch {
      setError("Failed to get suggestion. Please try again.");
    } finally {
      setLoadingSuggestion(false);
    }
  };

  const acceptSuggestion = () => {
    setText((prev) => prev + (prev.endsWith(" ") ? "" : " ") + suggestion);
    setSuggestion("");
  };
  const rejectSuggestion = () => {
    setSuggestion("");
  };

  const handleSelectStory = (story) => setText(story.content);
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
            <QuoteOfTheDay />
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

          <div className={styles["writing-screen__actions"]}>
            <button
              className={styles["writing-screen__suggest-button"]}
              type="button"
              onClick={handleSuggestClick}
              disabled={loadingSuggestion || !text.trim()}
              aria-busy={loadingSuggestion}
              aria-label="Ask AI for next sentence suggestion"
            >
              <Sparkles className={styles["suggest-icon"]} size={18} />
              {loadingSuggestion ? <ThinkingDots /> : "Suggest next sentence"}
            </button>

            <button
              className={styles["save-button"]}
              type="button"
              onClick={saveStory}
            >
              <Save
                className={styles["save-icon"]}
                size={18}
                aria-hidden="true"
              />
              Save Story
            </button>
          </div>

          {error && (
            <p className={styles["writing-screen__error"]} role="alert">
              {error}
            </p>
          )}

          {suggestion && (
            <div className={styles["writing-screen__suggestion-box"]}>
              <p className={styles["writing-screen__suggestion-label"]}>
                ✨ AI suggestion
              </p>
              <p className={styles["writing-screen__suggestion-text"]}>
                {suggestion}
              </p>
              <div className={styles["writing-screen__suggestion-actions"]}>
                <button
                  className={styles["writing-screen__suggestion-reject"]}
                  onClick={rejectSuggestion}
                >
                  <XCircle
                    className={styles["suggestion-icon"]}
                    size={16}
                    aria-hidden="true"
                  />
                  <span className={styles["visually-hidden"]}>
                    Reject suggestion
                  </span>
                  Reject
                </button>
                <button
                  className={styles["writing-screen__suggestion-accept"]}
                  onClick={acceptSuggestion}
                >
                  <CheckCircle
                    className={styles["suggestion-icon"]}
                    size={16}
                    aria-hidden="true"
                  />
                  <span className={styles["visually-hidden"]}>
                    Accept suggestion
                  </span>
                  Accept
                </button>
              </div>
            </div>
          )}

          {isSaved && (
            <div
              className={styles["writing-screen__status"]}
              role="status"
              aria-live="polite"
            >
              ✨ Draft saved automatically
            </div>
          )}
        </div>

        <SavedStories
          stories={stories}
          onSelect={handleSelectStory}
          onDelete={handleDeleteStory}
        />
      </div>

      {toastMessage && (
        <Toast message={toastMessage} onClose={() => setToastMessage("")} />
      )}
    </section>
  );
};

export default WritingScreen;
