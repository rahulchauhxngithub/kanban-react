import { useState, useRef } from "react";

function Card({ id, title, priority, status, onDelete, onMove, onEdit }) {
  const [isEditing, setIsEditing] = useState(false);
  const [draft, setDraft] = useState(title);
  const [isDragging, setIsDragging] = useState(false);
  const finished = useRef(false);

  function startEdit() {
    setDraft(title);
    finished.current = false;
    setIsEditing(true);
  }

  function finish(save) {
    if (finished.current) return;
    finished.current = true;

    const newTitle = draft.trim();
    if (save && newTitle !== "" && newTitle !== title) {
      onEdit(id, newTitle);
    }
    setIsEditing(false);
  }

  function handleKeyDown(event) {
    if (event.key === "Enter") finish(true);
    if (event.key === "Escape") finish(false);
  }

  // Pick up: put the id in the carrier the browser gives us
  function handleDragStart(event) {
    event.dataTransfer.setData("text/plain", String(id));
    setIsDragging(true);
  }

  // Put down (even if dropped outside a column)
  function handleDragEnd() {
    setIsDragging(false);
  }

  return (
    <article
      className={`card ${isDragging ? "dragging" : ""}`}
      draggable={!isEditing}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      {isEditing ? (
        <input
          className="edit-input"
          value={draft}
          onChange={event => setDraft(event.target.value)}
          onKeyDown={handleKeyDown}
          onBlur={() => finish(true)}
          onFocus={event => event.target.select()}
          autoFocus
          aria-label="Edit task title"
        />
      ) : (
        <h3 onDoubleClick={startEdit}>{title}</h3>
      )}

      <span className={`badge ${priority}`}>{priority}</span>

      <select
        className="move-select"
        value={status}
        onChange={event => onMove(id, event.target.value)}
        aria-label={`Move ${title}`}
      >
        <option value="todo">To Do</option>
        <option value="in-progress">In Progress</option>
        <option value="done">Done</option>
      </select>

      <button
        className="edit-btn"
        onClick={startEdit}
        aria-label={`Edit ${title}`}
      >
        ✎
      </button>

      <button
        className="delete-btn"
        onClick={() => onDelete(id)}
        aria-label={`Delete ${title}`}
      >
        ✕
      </button>
    </article>
  );
}

export default Card;