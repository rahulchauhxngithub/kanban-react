import { useState } from "react";
import Card from "./Card.jsx";

function Column({ title, status, tasks, onDelete, onMove, onEdit }) {
  const [isDragOver, setIsDragOver] = useState(false);

  // Allow dropping here (without preventDefault, onDrop will NOT work)
  function handleDragOver(event) {
    event.preventDefault();
    setIsDragOver(true);
  }

  // Only turn the highlight off when the card really leaves the column,
  // not when it moves over a card inside the column
  function handleDragLeave(event) {
    if (!event.currentTarget.contains(event.relatedTarget)) {
      setIsDragOver(false);
    }
  }

  // Drop: read the id, then ask the parent to move that task here
  function handleDrop(event) {
    event.preventDefault();
    setIsDragOver(false);

    const id = Number(event.dataTransfer.getData("text/plain"));
    onMove(id, status);
  }

  return (
    <section
      className={`column ${isDragOver ? "drag-over" : ""}`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <h2 className="column-title">
        {title} <span className="count">{tasks.length}</span>
      </h2>

      {tasks.length === 0 && <p className="empty">No tasks here</p>}

      {tasks.map(task => (
        <Card
          key={task.id}
          id={task.id}
          title={task.title}
          priority={task.priority}
          status={task.status}
          onDelete={onDelete}
          onMove={onMove}
          onEdit={onEdit}
        />
      ))}
    </section>
  );
}

export default Column;