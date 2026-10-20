import { useState, useEffect } from "react";

// Gives back a copy of "value" that updates only after
// the value has stopped changing for "delay" milliseconds.
export function useDebounce(value, delay = 300) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    // Start a timer. If it finishes, update the delayed copy.
    const timerId = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    // Cleanup: before the effect runs again, cancel the old timer.
    return () => clearTimeout(timerId);
  }, [value, delay]);

  return debouncedValue;
}