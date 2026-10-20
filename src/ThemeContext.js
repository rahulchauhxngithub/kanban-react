import { createContext, useContext } from "react";

// The "office wall". It starts empty, and the Provider fills it in.
export const ThemeContext = createContext(null);

// A small hook so any component can read the theme in one line
export function useTheme() {
  const value = useContext(ThemeContext);

  if (value === null) {
    throw new Error("useTheme must be used inside a ThemeProvider");
  }

  return value;
}