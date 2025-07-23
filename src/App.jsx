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
        className="theme-toggle"
        onClick={() => setIsDarkMode((prev) => !prev)}
        aria-label="Toggle dark mode"
      >
        {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
      </button>
      <WritingScreen />
    </main>
  );
}

export default App;
