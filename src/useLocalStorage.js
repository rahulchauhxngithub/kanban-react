import { useState, useEffect } from "react";

// Works like useState, but the value is also kept in localStorage.
// - key: the name of the drawer slot
// - initialValue: what to use when nothing (valid) is saved yet
// - isValid: an optional check on what was read from the drawer
export function useLocalStorage(key, initialValue, isValid = () => true) {
  const [value, setValue] = useState(() => {
    try {
      const saved = localStorage.getItem(key);
      if (saved === null) return initialValue;

      const parsed = JSON.parse(saved);
      return isValid(parsed) ? parsed : initialValue;
    } catch {
      // The saved text was broken, so start fresh
      return initialValue;
    }
  });

  // Whenever the value changes, copy it into the drawer
  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(value));
  }, [key, value]);

  return [value, setValue];
}