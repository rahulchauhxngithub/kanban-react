import { useEffect } from "react";
import { ThemeContext } from "./themeContext.js";
import { useLocalStorage } from "./useLocalStorage.js";

// Holds the theme, saves it, applies it to the <body>,
// and shares it with everything inside.
export function ThemeProvider({ children }) {
  const [theme, setTheme] = useLocalStorage("kanban-react-theme", "light");

  useEffect(() => {
    document.body.classList.toggle("dark", theme === "dark");
  }, [theme]);

  function toggleTheme() {
    setTheme(theme === "dark" ? "light" : "dark");
  }

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}