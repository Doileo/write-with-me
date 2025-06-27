import React from "react";
import { Trash2 } from "lucide-react";
import styles from "./SavedStories.module.css";

const SavedStories = ({ stories, onSelect, onDelete }) => {
  if (!stories || stories.length === 0) {
    return (
      <section className={styles["saved-stories"]}>
        <p className={styles["saved-stories__empty"]}>
          No saved stories yet. Start writing and save to see them here!
        </p>
      </section>
    );
  }

  return (
    <section className={styles["saved-stories"]}>
      <h2 className={styles["saved-stories__heading"]}>Saved Stories</h2>

      <ul className={styles["saved-stories__list"]}>
        {stories.map((story) => (
          <li key={story.id} className={styles["saved-stories__item"]}>
            <div>
              <h3 className={styles["saved-stories__title"]}>{story.title}</h3>
              <p className={styles["saved-stories__date"]}>
                Saved on {new Date(story.dateSaved).toLocaleDateString()}
              </p>
            </div>
            <div className={styles["saved-stories__actions"]}>
              <button
                onClick={() => onSelect(story)}
                className={styles["saved-stories__continue"]}
              >
                Continue writing
              </button>
              <button
                onClick={() => onDelete(story.id)}
                aria-label={`Delete story ${story.title}`}
                className={styles["saved-stories__delete"]}
              >
                <Trash2 size={20} strokeWidth={1.8} />
              </button>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
};

export default SavedStories;
