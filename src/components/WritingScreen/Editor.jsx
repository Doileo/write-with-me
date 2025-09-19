import React from "react";
import styles from "./WritingScreen.module.css";

const Editor = ({ text, setText, currentStoryId, onCancelEdit }) => {
  return (
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
          onClick={onCancelEdit}
          aria-label="Cancel editing current story"
        >
          Cancel Edit
        </button>
      )}
    </div>
  );
};

export default Editor;
