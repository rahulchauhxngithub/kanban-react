import { useState, useMemo } from "react";
import "./App.css";
import Column from "./Column.jsx";
import Quote from "./Quote.jsx";
import ThemeToggle from "./ThemeToggle.jsx";
import { useDebounce } from "./useDebounce.js";
import { useLocalStorage } from "./useLocalStorage.js";

const startTasks = [
  { id: 1, title: "Design the layout", status: "done", priority: "low" },
  { id: 2, title: "Learn components", status: "done", priority: "medium" },
  { id: 3, title: "Build the list with map", status: "in-progress", priority: "high" },
  { id: 4, title: "Add state", status: "todo", priority: "high" },
  { id: 5, title: "Add drag and drop", status: "todo", priority: "medium" }
];

function App() {
  // Behaves like useState, but is saved automatically
  const [tasks, setTasks] = useLocalStorage(
    "kanban-react-tasks",
    startTasks,
    Array.isArray
  );

  const [title, setTitle] = useState("");
  const [newPriority, setNewPriority] = useState("medium");
  const [search, setSearch] = useState("");
  const [priorityFilter, setPriorityFilter] = useState("all");

  // A delayed copy of the search text (updates 300ms after you stop typing)
  const debouncedSearch = useDebounce(search, 300);

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

  // Filter and split into columns, only when something it uses changes
  const tasksByStatus = useMemo(() => {
    const visible = tasks.filter(task =>
      task.title.toLowerCase().includes(debouncedSearch.trim().toLowerCase()) &&
      (priorityFilter === "all" || task.priority === priorityFilter)
    );

    return {
      todo: visible.filter(task => task.status === "todo"),
      "in-progress": visible.filter(task => task.status === "in-progress"),
      done: visible.filter(task => task.status === "done")
    };
  }, [tasks, debouncedSearch, priorityFilter]);

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

        <ThemeToggle />
      </header>

      <Quote />

      <main className="board">
        <Column
          title="To Do"
          status="todo"
          tasks={tasksByStatus.todo}
          onDelete={deleteTask}
          onMove={moveTask}
          onEdit={editTask}
        />
        <Column
          title="In Progress"
          status="in-progress"
          tasks={tasksByStatus["in-progress"]}
          onDelete={deleteTask}
          onMove={moveTask}
          onEdit={editTask}
        />
        <Column
          title="Done"
          status="done"
          tasks={tasksByStatus.done}
          onDelete={deleteTask}
          onMove={moveTask}
          onEdit={editTask}
        />
      </main>
    </div>
  );
}

export default App;