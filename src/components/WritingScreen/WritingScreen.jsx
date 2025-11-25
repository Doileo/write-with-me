import React, { useState, useEffect } from "react";
import Editor from "./Editor";
import StatsCounter from "./StatsCounter";
import StreakCounter from "./StreakCounter";
import SavedStories from "../SavedStories/SavedStories";
import ThinkingDots from "../ThinkingDots/ThinkingDots";
import QuoteOfTheDay from "../QuoteOfTheDay/QuoteOfTheDay";
import Toast from "../Toast/Toast";
import { getAISuggestion } from "../../api/openai";
import { Sparkles, CheckCircle, XCircle, Save, Download } from "lucide-react";
import styles from "./WritingScreen.module.css";
import useDraft from "../../hooks/useDraft";

// Key used to store saved stories in localStorage
const STORIES_STORAGE_KEY = "writeWithMe-stories";

const WritingScreen = () => {
  // ------------------- Hook for draft, counts, and streak -------------------
  const {
    text, // Current text in editor
    setText, // Function to update editor text
    charCount, // Character count of the current text
    wordCount, // Word count
    readingTime, // Estimated reading time in minutes
    daysShownUp, // Number of days user has written
    isSaved, // Flag for showing draft auto-saved status
  } = useDraft();

  // ------------------- Local state for component -------------------
  const [stories, setStories] = useState([]); // All saved stories
  const [suggestion, setSuggestion] = useState(""); // AI suggestion text
  const [loadingSuggestion, setLoadingSuggestion] = useState(false); // Loading spinner
  const [error, setError] = useState(null); // Error message for AI suggestion
  const [toastMessage, setToastMessage] = useState(""); // Toast notifications
  const [currentStoryId, setCurrentStoryId] = useState(null); // If editing existing story
  const [sparkleTrigger, setSparkleTrigger] = useState(false); // Sparkle animation for streak

  // ------------------- Load saved stories from localStorage -------------------
  useEffect(() => {
    const savedStories = localStorage.getItem(STORIES_STORAGE_KEY);
    if (savedStories) setStories(JSON.parse(savedStories));
  }, []);

  // ------------------- Trigger sparkle animation when streak increases -------------------
  useEffect(() => {
    if (daysShownUp > 0) {
      setSparkleTrigger(true);
      const timer = setTimeout(() => setSparkleTrigger(false), 800);
      return () => clearTimeout(timer);
    }
  }, [daysShownUp]);

  // ------------------- Story actions -------------------

  // Save or update a story
  const saveStory = () => {
    if (!text.trim()) {
      setToastMessage("❗ Please write something before saving.");
      return;
    }

    // Ask for story title
    const title = window.prompt(
      "Enter a title for your story:",
      "Untitled Story"
    );
    if (title === null) return; // Cancel pressed

    const updatedStories = [...stories];
    const dateSaved = new Date().toISOString();

    if (currentStoryId) {
      // Update existing story
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
      // Create new story
      const newStory = {
        id: Date.now().toString(),
        title: title.trim() || "Untitled Story",
        content: text,
        dateSaved,
      };
      updatedStories.push(newStory);
      setToastMessage(`✅ "${newStory.title}" saved successfully!`);
    }

    // Save stories to state and localStorage
    setStories(updatedStories);
    localStorage.setItem(STORIES_STORAGE_KEY, JSON.stringify(updatedStories));

    // Reset editor
    setText("");
    setCurrentStoryId(null);
    localStorage.removeItem("writeWithMe-draft");
  };

  // Ask AI for a suggestion based on current text
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

  // Accept AI suggestion and append it to the text
  const acceptSuggestion = () => {
    setText((prev) => prev + (prev.endsWith(" ") ? "" : " ") + suggestion);
    setSuggestion("");
  };

  // Reject AI suggestion
  const rejectSuggestion = () => {
    setSuggestion("");
  };

  // Load a saved story into the editor
  const handleSelectStory = (story) => {
    setText(story.content);
    setCurrentStoryId(story.id);
  };

  // Delete a story from saved stories
  const handleDeleteStory = (id) => {
    const storyToDelete = stories.find((s) => s.id === id);
    const filteredStories = stories.filter((s) => s.id !== id);
    setStories(filteredStories);
    localStorage.setItem(STORIES_STORAGE_KEY, JSON.stringify(filteredStories));

    // Clear editor if deleted story is currently open
    if (storyToDelete && storyToDelete.content === text) {
      setText("");
      setCurrentStoryId(null);
      localStorage.removeItem("writeWithMe-draft");
    }
  };

  // Helper: Download text file
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

  // Export current text as .txt
  const exportTxt = () => {
    if (!text.trim()) {
      setToastMessage("❗ Nothing to export.");
      return;
    }
    downloadFile("story.txt", text);
  };

  // ------------------- Render -------------------
  const isEmpty = !text.trim();

  return (
    <section className={styles["writing-screen"]}>
      <div className={styles["writing-screen__container"]}>
        <div className={styles["writing-screen__left"]}>
          {/* Header & Quote */}
          <div className={styles["writing-screen__intro"]}>
            <h1 className={styles["writing-screen__heading"]}>Write With Me</h1>
            <p className={styles["writing-screen__subtext"]}>
              A focused space for your thoughts, stories, and reflections.
            </p>
            <QuoteOfTheDay />
          </div>

          {/* Editor */}
          <Editor
            text={text}
            setText={setText}
            currentStoryId={currentStoryId}
            onCancelEdit={() => {
              setText("");
              setCurrentStoryId(null);
              localStorage.removeItem("writeWithMe-draft");
            }}
          />

          {/* Stats & Streak */}
          <StatsCounter
            wordCount={wordCount}
            charCount={charCount}
            readingTime={readingTime}
          />
          <StreakCounter
            daysShownUp={daysShownUp}
            sparkleTrigger={sparkleTrigger}
          />

          {/* Action Buttons: Suggest, Save, Download */}
          <div className={styles["writing-screen__actions"]}>
            <button
              className={styles["writing-screen__suggest-button"]}
              type="button"
              onClick={handleSuggestClick}
              disabled={loadingSuggestion || isEmpty}
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
              disabled={isEmpty}
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
              disabled={isEmpty}
              aria-label="Download your story as a text file"
            >
              <Download size={18} aria-hidden="true" />
              Download
            </button>
          </div>

          {/* Helper text when empty */}
          {isEmpty && (
            <p className={styles["writing-screen__actions-helper"]}>
              Start writing to enable suggestions, saving, and download.
            </p>
          )}

          {/* Error message */}
          {error && (
            <p className={styles["writing-screen__error"]} role="alert">
              {error}
            </p>
          )}

          {/* AI suggestion box */}
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

          {/* Draft saved indicator */}
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

        {/* Sidebar with saved stories */}
        <SavedStories
          stories={stories}
          onSelect={handleSelectStory}
          onDelete={handleDeleteStory}
        />
      </div>

      {/* Toast notifications */}
      {toastMessage && (
        <Toast message={toastMessage} onClose={() => setToastMessage("")} />
      )}
    </section>
  );
};

export default WritingScreen;
