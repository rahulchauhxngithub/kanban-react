# Kanban Board (React)

A task board built with **React** and **Vite**. This is the React version of my plain JavaScript Kanban board, rebuilt to compare the two approaches.

**Live demo:** (https://kanban-react-73whal5fc-chauhxn.vercel.app/)

## Features

- Add, edit and delete tasks
- Three columns: To Do, In Progress, Done
- Move tasks by drag and drop, or with a dropdown (keyboard friendly)
- Priority labels and a priority filter
- Search tasks by title
- Dark mode that remembers your choice
- Tasks saved in `localStorage`, so they survive a refresh
- Random quote loaded with `fetch`, with loading and error states
- Task count on each column and a message for empty columns

## Tech used

- React (function components, `useState`, `useEffect`, `useRef`)
- Vite
- CSS (Flexbox, CSS variables, media queries)

## How it works

| File | Job |
|---|---|
| `src/App.jsx` | Owns the task list (state) and the functions that change it. Works out which tasks to show for the search and filter. |
| `src/Column.jsx` | Shows one column and accepts dropped cards. |
| `src/Card.jsx` | Shows one task. Keeps its own small state for editing and dragging. |
| `src/Quote.jsx` | Fetches a quote with loading, error and cleanup handling. |

The main pattern: **state goes down as props, and changes go up through functions.** Every change builds a new array or object instead of editing the old one, so React can see it.

## Decisions I made

- **Derived state:** the filtered task list is worked out while drawing, not stored, so there is only one source of truth.
- **State close to where it is used:** a card keeps its own `isEditing` and `isDragging`. Only shared data lives in `App`.
- **One `useEffect` per job:** one saves tasks, one applies the theme. Each has its own dependency list.
- **`fetch` cleanup:** an `ignore` flag stops an old request from overwriting a newer one.
- **Dropdown kept next to drag and drop**, because drag and drop does not work with a keyboard.

## Known limitations and next steps

- Cards can move between columns but cannot be reordered inside a column.
- No undo and redo.
- Data is stored only in the browser, so it does not sync across devices.
- Next: add a Node and Express backend with a database.

## Run locally

```bash
npm install
npm run dev
```

## Build for production

```bash
npm run build
npm run preview
```

## Author

Rahul