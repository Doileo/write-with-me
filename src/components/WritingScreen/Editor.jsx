import React, { forwardRef, useEffect, useRef } from "react";
import styles from "./WritingScreen.module.css";

// ForwardRef allows parent components to access the textarea DOM node if needed
const Editor = forwardRef(
  ({ text, setText, currentStoryId, onCancelEdit }, ref) => {
    // Use an internal ref if no ref is passed from parent
    const internalRef = useRef(null);
    const textareaRef = ref || internalRef;

    // ------------------- Step 1: Auto-focus textarea when editing an existing story -------------------
    // Improves UX by immediately allowing users to continue typing without an extra click
    useEffect(() => {
      if (currentStoryId && textareaRef.current) {
        textareaRef.current.focus();
      }
    }, [currentStoryId, textareaRef]);

    return (
      <div className={styles["writing-screen__editor"]}>
        {/* ------------------- Step 2: Container holds the textarea and decorative placeholder ------------------- */}
        <div className={styles["editor-container"]}>
          {/* Step 2a: Visually hidden label for screen readers */}
          {/* Ensures accessibility for assistive tech without showing duplicate text visually */}
          <label htmlFor="story-editor" className={styles["visually-hidden"]}>
            Begin anywhere. Let your words arrive naturally.
          </label>

          {/* Step 2b: Decorative placeholder */}
          {/* Provides a visual hint to the user, but hidden from screen readers to avoid redundancy */}
          <div
            className={`${styles["editor-placeholder"]} ${
              text.trim() === "" ? styles.visible : styles.hidden
            }`}
            aria-hidden="true"
          >
            Begin anywhere. Let your words arrive naturally.
          </div>

          {/* Step 2c: Controlled textarea */}
          {/* Keeps text state in sync with parent, allows programmatic control, and supports undo/redo */}
          <textarea
            id="story-editor"
            ref={textareaRef}
            className={styles["editor__textarea"]}
            value={text}
            onChange={(e) => setText(e.target.value)}
            rows={5}
            aria-label="Writing editor" // For screen readers, describes the purpose of this field
          />
        </div>

        {/* ------------------- Step 3: Cancel edit button for editing mode ------------------- */}
        {/* Provides a clear way to abandon edits; only shown when editing an existing story */}
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
  }
);

export default Editor;
