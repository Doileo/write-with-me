import React, { useEffect, useState } from "react";
import styles from "./QuoteOfTheDay.module.css";
import { RefreshCw, ChevronDown } from "lucide-react";

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
  const [quote, setQuote] = useState("");
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const fetchQuote = () => {
    setLoading(true);
    setTimeout(() => {
      const random =
        fallbackQuotes[Math.floor(Math.random() * fallbackQuotes.length)];
      setQuote(random);
      setLoading(false);
    }, 500);
  };

  useEffect(() => {
    fetchQuote();
  }, []);

  return (
    <div className={styles.quoteBox}>
      <button
        className={styles.toggleButton}
        onClick={() => setIsOpen((prev) => !prev)}
      >
        <span>{isOpen ? "Hide quote" : "Show quote"}</span>
        <ChevronDown
          className={`${styles.arrowIcon} ${isOpen ? styles.arrowOpen : ""}`}
          size={16}
        />
      </button>

      <div
        className={`${styles.quoteContent} ${isOpen ? styles.open : ""}`}
        aria-hidden={!isOpen}
      >
        <blockquote className={styles.quoteText}>
          {loading ? "Loading quote..." : quote}
        </blockquote>
        <button
          onClick={fetchQuote}
          className={`${styles.refreshButton} ${loading ? styles.loading : ""}`}
          aria-label="Refresh quote"
          disabled={loading}
        >
          <RefreshCw className={styles.refreshIcon} size={16} />
        </button>
      </div>
    </div>
  );
};

export default QuoteOfTheDay;
