import { useState, useEffect } from "react";

const QUOTE_URL = "https://dummyjson.com/quotes/random";

function Quote() {
  const [quote, setQuote] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [reloadCount, setReloadCount] = useState(0);

  useEffect(() => {
    // "ignore" becomes true if this request is replaced or the component leaves
    let ignore = false;

    async function loadQuote() {
      // 1. Show loading
      setLoading(true);
      setError("");

      try {
        // 2. Try the request
        const response = await fetch(QUOTE_URL);
        if (!response.ok) throw new Error(`Server error: ${response.status}`);

        const data = await response.json();

        // 3. Keep the quote (unless we were replaced)
        if (!ignore) setQuote(data);
      } catch (err) {
        // 4. Show an error
        if (!ignore) setError("Could not load a quote. Please try again.");
      } finally {
        if (!ignore) setLoading(false);
      }
    }

    loadQuote();

    // Cleanup: runs before the effect runs again, and when the component leaves
    return () => {
      ignore = true;
    };
  }, [reloadCount]);

  return (
    <section className="quote-bar">
      <div className="quote-content" aria-live="polite">
        {loading && <p className="quote-text">Loading...</p>}
        {error && <p className="quote-text">{error}</p>}
        {!loading && !error && quote && (
          <>
            <p className="quote-text">“{quote.quote}”</p>
            <p className="quote-author">— {quote.author}</p>
          </>
        )}
      </div>

      <button
        type="button"
        className="quote-btn"
        onClick={() => setReloadCount(reloadCount + 1)}
        disabled={loading}
      >
        New quote
      </button>
    </section>
  );
}

export default Quote;