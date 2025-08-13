import { useEffect, useState } from "react";
import WritingScreen from "./components/WritingScreen/WritingScreen";
import { Sun, Moon } from "lucide-react";
import "./App.css";

function App() {
  const [isDarkMode, setIsDarkMode] = useState(() => {
    return localStorage.getItem("theme") === "dark";
  });

  useEffect(() => {
    document.documentElement.setAttribute(
      "data-theme",
      isDarkMode ? "dark" : "light"
    );
    localStorage.setItem("theme", isDarkMode ? "dark" : "light");
  }, [isDarkMode]);

  return (
    <main>
      <div className="theme-toggle-wrapper">
        <Sun className={`icon sun ${!isDarkMode ? "active" : ""}`} size={20} />

        <button
          className={`theme-toggle ${isDarkMode ? "dark" : "light"}`}
          onClick={() => setIsDarkMode((prev) => !prev)}
          aria-label="Toggle dark mode"
        >
          <span className="toggle-slider" />
        </button>

        <Moon className={`icon moon ${isDarkMode ? "active" : ""}`} size={20} />
      </div>
      <WritingScreen />
    </main>
  );
}

export default App;
