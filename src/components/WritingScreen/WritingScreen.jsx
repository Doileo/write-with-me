import React, { useState, useEffect } from "react";
import styles from "./WritingScreen.module.css";
import SavedStories from "../SavedStories/SavedStories";
import ThinkingDots from "./ThinkingDots";
import QuoteOfTheDay from "./QuoteOfTheDay";
import Toast from "./Toast";
import { getAISuggestion } from "../../api/openai";
import { Sparkles, CheckCircle, XCircle, Save, Download } from "lucide-react";

const DRAFT_STORAGE_KEY = "writeWithMe-draft";
const STORIES_STORAGE_KEY = "writeWithMe-stories";
const SHOWN_UP_DAYS_KEY = "writeWithMe-shown-up-days";

const WritingScreen = () => {
  const [text, setText] = useState("");
  const [isSaved, setIsSaved] = useState(false);
  const [stories, setStories] = useState([]);
  const [suggestion, setSuggestion] = useState("");
  const [loadingSuggestion, setLoadingSuggestion] = useState(false);
  const [error, setError] = useState(null);
  const [toastMessage, setToastMessage] = useState("");
  const [charCount, setCharCount] = useState(0);
  const [wordCount, setWordCount] = useState(0);
  const [readingTime, setReadingTime] = useState(0);
  const [daysShownUp, setDaysShownUp] = useState(0);
  const [currentStoryId, setCurrentStoryId] = useState(null);
  const [sparkleTrigger, setSparkleTrigger] = useState(false);

  // Load initial data
  useEffect(() => {
    const savedText = localStorage.getItem(DRAFT_STORAGE_KEY);
    if (savedText) setText(savedText);

    const savedStories = localStorage.getItem(STORIES_STORAGE_KEY);
    if (savedStories) setStories(JSON.parse(savedStories));

    const storedDays =
      JSON.parse(localStorage.getItem(SHOWN_UP_DAYS_KEY)) || [];
    setDaysShownUp(storedDays.length);
  }, []);

  // Track day count increment for sparkle animation
  useEffect(() => {
    if (daysShownUp > 0) {
      setSparkleTrigger(true);
      const timer = setTimeout(() => setSparkleTrigger(false), 800);
      return () => clearTimeout(timer);
    }
  }, [daysShownUp]);

  // Auto-save, counts, and day streak
  useEffect(() => {
    const saveDraftTimeout = setTimeout(() => {
      localStorage.setItem(DRAFT_STORAGE_KEY, text);
      setIsSaved(true);

      const clearStatusTimeout = setTimeout(() => setIsSaved(false), 2000);
      return () => clearTimeout(clearStatusTimeout);
    }, 500);

    // update counts
    const words = text.trim() === "" ? 0 : text.trim().split(/\s+/).length;
    setWordCount(words);
    setCharCount(text.length);
    setReadingTime(Math.max(1, Math.ceil(words / 200))); // at least 1 min if > 0 words

    // handle days shown up
    if (text.trim().length > 0) {
      const today = new Date().toISOString().split("T")[0]; // YYYY-MM-DD
      const storedDays =
        JSON.parse(localStorage.getItem(SHOWN_UP_DAYS_KEY)) || [];

      if (!storedDays.includes(today)) {
        const updatedDays = [...storedDays, today];
        localStorage.setItem(SHOWN_UP_DAYS_KEY, JSON.stringify(updatedDays));
        setDaysShownUp(updatedDays.length); // triggers sparkle animation
      }
    }

    return () => clearTimeout(saveDraftTimeout);
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

    const updatedStories = [...stories];
    const dateSaved = new Date().toISOString();

    if (currentStoryId) {
      const index = updatedStories.findIndex((s) => s.id === currentStoryId);
      if (index !== -1) {
        updatedStories[index] = {
          ...updatedStories[index],
          title: title.trim() || "Untitled Story",
          content: text,
          dateSaved,
        };
        setToastMessage(
          `✅ "${updatedStories[index].title}" updated successfully!`
        );
      }
    } else {
      const newStory = {
        id: Date.now().toString(),
        title: title.trim() || "Untitled Story",
        content: text,
        dateSaved,
      };
      updatedStories.push(newStory);
      setToastMessage(`✅ "${newStory.title}" saved successfully!`);
    }

    setStories(updatedStories);
    localStorage.setItem(STORIES_STORAGE_KEY, JSON.stringify(updatedStories));
    setText("");
    setCurrentStoryId(null);
    localStorage.removeItem(DRAFT_STORAGE_KEY);
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

  const handleSelectStory = (story) => {
    setText(story.content);
    setCurrentStoryId(story.id);
  };

  const handleDeleteStory = (id) => {
    const storyToDelete = stories.find((s) => s.id === id);
    const filteredStories = stories.filter((s) => s.id !== id);
    setStories(filteredStories);
    localStorage.setItem(STORIES_STORAGE_KEY, JSON.stringify(filteredStories));

    if (storyToDelete && storyToDelete.content === text) {
      setText("");
      setCurrentStoryId(null);
      localStorage.removeItem(DRAFT_STORAGE_KEY);
    }
  };

  const downloadFile = (filename, content) => {
    const blob = new Blob([content], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = url;
    link.download = filename;

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    URL.revokeObjectURL(url);
  };

  const exportTxt = () => {
    if (!text.trim()) {
      setToastMessage("❗ Nothing to export.");
      return;
    }
    downloadFile("story.txt", text);
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
            <div className={styles["editor-container"]}>
              <div
                className={`${styles["editor-placeholder"]} ${
                  text.trim() === "" ? styles.visible : styles.hidden
                }`}
                aria-hidden="true"
              >
                Write the first line of your story, reflection, or idea…
              </div>

              <textarea
                className={styles["editor__textarea"]}
                aria-label="Writing editor"
                value={text}
                onChange={(e) => setText(e.target.value)}
              />
            </div>

            {currentStoryId && (
              <button
                className={styles["cancel-edit-button"]}
                onClick={() => {
                  setText("");
                  setCurrentStoryId(null);
                  localStorage.removeItem(DRAFT_STORAGE_KEY);
                }}
                aria-label="Cancel editing current story"
              >
                Cancel Edit
              </button>
            )}
          </div>

          <div className={styles["writing-screen__counter"]}>
            <span>{wordCount} words</span> · <span>{charCount} characters</span>{" "}
            · <span>{readingTime} min read</span>
          </div>

          <div className={styles["writing-screen__streak"]}>
            <Sparkles
              size={18}
              className={sparkleTrigger ? styles["sparkle-animate"] : ""}
            />
            Days you’ve shown up: {daysShownUp}
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
              aria-label="Save your story"
            >
              <Save
                className={styles["save-icon"]}
                size={18}
                aria-hidden="true"
              />
              {currentStoryId ? "Update Story" : "Save Story"}
            </button>

            <button
              className={styles["export-button"]}
              type="button"
              onClick={exportTxt}
              aria-label="Download your story as a text file"
            >
              <Download size={18} aria-hidden="true" />
              Download
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
                  aria-label="Reject AI suggestion"
                >
                  <XCircle
                    className={styles["suggestion-icon"]}
                    size={16}
                    aria-hidden="true"
                  />
                  Reject
                </button>
                <button
                  className={styles["writing-screen__suggestion-accept"]}
                  onClick={acceptSuggestion}
                  aria-label="Accept AI suggestion"
                >
                  <CheckCircle
                    className={styles["suggestion-icon"]}
                    size={16}
                    aria-hidden="true"
                  />
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
