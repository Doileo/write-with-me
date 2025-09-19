import { useState, useEffect } from "react";

const DRAFT_STORAGE_KEY = "writeWithMe-draft";
const SHOWN_UP_DAYS_KEY = "writeWithMe-shown-up-days";

export default function useDraft(initialText = "") {
  const [text, setText] = useState(initialText);
  const [charCount, setCharCount] = useState(0);
  const [wordCount, setWordCount] = useState(0);
  const [readingTime, setReadingTime] = useState(0);
  const [daysShownUp, setDaysShownUp] = useState(0);
  const [isSaved, setIsSaved] = useState(false);

  // Load initial draft and streak
  useEffect(() => {
    const savedText = localStorage.getItem(DRAFT_STORAGE_KEY);
    if (savedText) setText(savedText);

    const storedDays =
      JSON.parse(localStorage.getItem(SHOWN_UP_DAYS_KEY)) || [];
    setDaysShownUp(storedDays.length);
  }, []);

  // Auto-save and counts
  useEffect(() => {
    const saveTimeout = setTimeout(() => {
      localStorage.setItem(DRAFT_STORAGE_KEY, text);
      setIsSaved(true);
      const clearTimeoutId = setTimeout(() => setIsSaved(false), 2000);
      return () => clearTimeout(clearTimeoutId);
    }, 500);

    const words = text.trim() === "" ? 0 : text.trim().split(/\s+/).length;
    setWordCount(words);
    setCharCount(text.length);
    setReadingTime(Math.max(1, Math.ceil(words / 200)));

    // Update streak
    if (text.trim().length > 0) {
      const today = new Date().toISOString().split("T")[0];
      const storedDays =
        JSON.parse(localStorage.getItem(SHOWN_UP_DAYS_KEY)) || [];
      if (!storedDays.includes(today)) {
        const updatedDays = [...storedDays, today];
        localStorage.setItem(SHOWN_UP_DAYS_KEY, JSON.stringify(updatedDays));
        setDaysShownUp(updatedDays.length);
      }
    }

    return () => clearTimeout(saveTimeout);
  }, [text]);

  return {
    text,
    setText,
    charCount,
    wordCount,
    readingTime,
    daysShownUp,
    isSaved,
  };
}
