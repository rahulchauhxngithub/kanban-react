import { useState, useEffect } from "react";
import "./App.css";
import Column from "./Column.jsx";
import Quote from "./Quote.jsx";

const STORAGE_KEY = "kanban-react-tasks";
const THEME_KEY = "kanban-react-theme";

const startTasks = [
  { id: 1, title: "Design the layout", status: "done", priority: "low" },
  { id: 2, title: "Learn components", status: "done", priority: "medium" },
  { id: 3, title: "Build the list with map", status: "in-progress", priority: "high" },
  { id: 4, title: "Add state", status: "todo", priority: "high" },
  { id: 5, title: "Add drag and drop", status: "todo", priority: "medium" }
];

// Read from the drawer. If it is empty or broken, use the starter list.
function loadTasks() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY));
    return Array.isArray(saved) ? saved : startTasks;
  } catch {
    return startTasks;
  }
}

function App() {
  const [tasks, setTasks] = useState(() => loadTasks());
  const [title, setTitle] = useState("");
  const [newPriority, setNewPriority] = useState("medium");
  const [search, setSearch] = useState("");
  const [priorityFilter, setPriorityFilter] = useState("all");
  const [theme, setTheme] = useState(
    () => localStorage.getItem(THEME_KEY) || "light"
  );

  // Whenever tasks changes, copy it into the drawer
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
  }, [tasks]);

  // Whenever theme changes: update the <body> class and save the choice
  useEffect(() => {
    document.body.classList.toggle("dark", theme === "dark");
    localStorage.setItem(THEME_KEY, theme);
  }, [theme]);

  function addTask(event) {
    event.preventDefault();
    const text = title.trim();
    if (text === "") return;

    setTasks([
      ...tasks,
      { id: Date.now(), title: text, status: "todo", priority: newPriority }
    ]);
    setTitle("");
  }

  function deleteTask(id) {
    setTasks(tasks.filter(task => task.id !== id));
  }

  // Used by BOTH the dropdown and drag and drop
  function moveTask(id, newStatus) {
    setTasks(
      tasks.map(task =>
        task.id === id ? { ...task, status: newStatus } : task
      )
    );
  }

  function editTask(id, newTitle) {
    setTasks(
      tasks.map(task =>
        task.id === id ? { ...task, title: newTitle } : task
      )
    );
  }

  // Worked out while drawing. Not stored in state.
  const visibleTasks = tasks.filter(task =>
    task.title.toLowerCase().includes(search.trim().toLowerCase()) &&
    (priorityFilter === "all" || task.priority === priorityFilter)
  );

  function tasksWithStatus(status) {
    return visibleTasks.filter(task => task.status === status);
  }

  return (
    <div>
      <header className="app-header">
        <h1>Kanban Board</h1>

        <form className="task-form" onSubmit={addTask}>
          <input
            value={title}
            onChange={event => setTitle(event.target.value)}
            placeholder="Add a task..."
            aria-label="New task"
          />
          <select
            value={newPriority}
            onChange={event => setNewPriority(event.target.value)}
            aria-label="Priority for the new task"
          >
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
          <button type="submit">Add</button>
        </form>

        <input
          type="search"
          className="search-input"
          value={search}
          onChange={event => setSearch(event.target.value)}
          placeholder="Search tasks..."
          aria-label="Search tasks"
        />

        <select
          value={priorityFilter}
          onChange={event => setPriorityFilter(event.target.value)}
          aria-label="Filter by priority"
        >
          <option value="all">All priorities</option>
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
        </select>

        <button
          type="button"
          className="theme-toggle"
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          aria-label="Switch theme"
        >
          {theme === "dark" ? "☀️" : "🌙"}
        </button>
      </header>

      <Quote />

      <main className="board">
        <Column
          title="To Do"
          status="todo"
          tasks={tasksWithStatus("todo")}
          onDelete={deleteTask}
          onMove={moveTask}
          onEdit={editTask}
        />
        <Column
          title="In Progress"
          status="in-progress"
          tasks={tasksWithStatus("in-progress")}
          onDelete={deleteTask}
          onMove={moveTask}
          onEdit={editTask}
        />
        <Column
          title="Done"
          status="done"
          tasks={tasksWithStatus("done")}
          onDelete={deleteTask}
          onMove={moveTask}
          onEdit={editTask}
        />
      </main>
    </div>
  );
}

export default App;