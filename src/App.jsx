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
      <button
        className={`theme-toggle ${isDarkMode ? "dark" : "light"}`}
        onClick={() => setIsDarkMode((prev) => !prev)}
        aria-label="Toggle dark mode"
      >
        <Sun className="icon sun" size={20} />
        <Moon className="icon moon" size={20} />
        <span className="toggle-slider" />
      </button>
      <WritingScreen />
    </main>
  );
}

export default App;
