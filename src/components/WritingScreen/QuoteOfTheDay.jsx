import React, { useEffect, useState } from "react";
import styles from "./QuoteOfTheDay.module.css";
import { RefreshCw } from "lucide-react";

// Just in case the API doesn't work, here are some fallback quotes
// so the app still shows something meaningful instead of breaking.
const fallbackQuotes = [
  "“There is no greater agony than bearing an untold story inside you.” – Maya Angelou",
  "“Start writing, no matter what. The water does not flow until the faucet is turned on.” – Louis L’Amour",
  "“The scariest moment is always just before you start.” – Stephen King",
  "“You can always edit a bad page. You can’t edit a blank page.” – Jodi Picoult",
  "“Fill your paper with the breathings of your heart.” – William Wordsworth",
];

const QuoteOfTheDay = () => {
  // This state keeps the quote text we're showing on screen
  const [quote, setQuote] = useState("");

  // Tracks whether we’re waiting for a quote from the API
  // Helps us show loading feedback and prevent spamming requests
  const [loading, setLoading] = useState(false);

  // This function fetches a random quote from the API
  // If it fails, we pick one from our fallback list instead
  const fetchQuote = async () => {
    setLoading(true); // Tell the app we’re loading something — UI will update accordingly
    try {
      const res = await fetch("https://api.quotable.io/random");

      // If the response isn’t OK, we throw an error to jump to the catch block
      if (!res.ok) throw new Error("Failed to fetch");

      const data = await res.json();

      // Format the quote nicely and save it in state to show on the page
      setQuote(`“${data.content}” – ${data.author}`);
    } catch (err) {
      // Log the error so we know what went wrong when debugging later
      console.error("Quote API error:", err);

      // Randomly pick one of our fallback quotes to keep things running smoothly
      const random =
        fallbackQuotes[Math.floor(Math.random() * fallbackQuotes.length)];
      setQuote(random);
    } finally {
      // Done loading whether it succeeded or failed, so update the UI again
      setLoading(false);
    }
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
