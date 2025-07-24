import React, { useEffect, useState } from "react";
import styles from "./QuoteOfTheDay.module.css";
import { RefreshCw } from "lucide-react";

// Fallback quotes relevant to writing, creativity, and motivation
const fallbackQuotes = [
  "“There is no greater agony than bearing an untold story inside you.” – Maya Angelou",
  "“Start writing, no matter what. The water does not flow until the faucet is turned on.” – Louis L’Amour",
  "“The scariest moment is always just before you start.” – Stephen King",
  "“You can always edit a bad page. You can’t edit a blank page.” – Jodi Picoult",
  "“Fill your paper with the breathings of your heart.” – William Wordsworth",
  "“You don’t write because you want to say something, you write because you have something to say.” – F. Scott Fitzgerald",
  "“If there's a book that you want to read, but it hasn't been written yet, then you must write it.” – Toni Morrison",
  "“Write what should not be forgotten.” – Isabel Allende",
  "“Writing is the painting of the voice.” – Voltaire",
  "“The first draft is just you telling yourself the story.” – Terry Pratchett",
  "“There is no real ending. It’s just the place where you stop the story.” – Frank Herbert",
  "“You can make anything by writing.” – C.S. Lewis",
];

const QuoteOfTheDay = () => {
  // This state keeps the quote text we're showing on screen
  const [quote, setQuote] = useState("");

  // Tracks whether we’re waiting for a quote from the API
  // Helps us show loading feedback and prevent spamming requests
  const [loading, setLoading] = useState(false);

  // This function picks a random quote from fallbackQuotes
  // and simulates loading with a small delay for UX
  const fetchQuote = () => {
    setLoading(true); // Show loading state
    setTimeout(() => {
      const random =
        fallbackQuotes[Math.floor(Math.random() * fallbackQuotes.length)];
      setQuote(random);
      setLoading(false); // Done loading
    }, 500); // 0.5 second delay to simulate fetch
  };

  // When the component first shows up, get a quote automatically
  // The empty dependency array means this runs only once after mounting
  useEffect(() => {
    fetchQuote();
  }, []);

  return (
    // Using aria-live so screen readers announce new quotes politely
    <div className={styles.quoteBox} role="region" aria-live="polite">
      {/* Show a loading message while waiting for the quote, else show the quote */}
      <blockquote className={styles.quoteText}>
        {loading ? "Loading quote..." : quote}
      </blockquote>

      {/* Button to refresh the quote on demand */}
      {/* Disabled during loading so user can’t spam clicks */}
      <button
        onClick={fetchQuote}
        className={`${styles.refreshButton} ${loading ? styles.loading : ""}`}
        aria-label="Refresh quote" // Makes button clear for screen readers
        disabled={loading}
      >
        {/* Refresh icon for a clear visual cue */}
        <RefreshCw className={styles.refreshIcon} size={16} />
      </button>
    </div>
  );
};

export default QuoteOfTheDay;
