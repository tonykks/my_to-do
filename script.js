const STORAGE_KEY = "todos";

/** @type {{ id: number, text: string, completed: boolean }[]} */
let todos = [];

const todoInput = document.getElementById("todo-input");
const addBtn = document.getElementById("add-btn");
const todoList = document.getElementById("todo-list");
const todoStatsEl = document.getElementById("todo-stats");

function loadTodos() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) {
      todos = [];
      return;
    }
    const parsed = JSON.parse(stored);
    if (!Array.isArray(parsed)) {
      todos = [];
      return;
    }
    todos = parsed.filter(isValidTodo);
  } catch {
    todos = [];
  }
}

function isValidTodo(item) {
  return (
    item != null &&
    typeof item === "object" &&
    typeof item.id === "number" &&
    typeof item.text === "string" &&
    typeof item.completed === "boolean"
  );
}

function nextId() {
  if (!todos.length) return Date.now();
  return Math.max(...todos.map((t) => t.id)) + 1;
}

function saveTodos() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
}

function getRemainingCount() {
  return todos.filter((t) => !t.completed).length;
}

function getCompletedCount() {
  return todos.filter((t) => t.completed).length;
}

function updateCount() {
  const completed = getCompletedCount();
  const remaining = getRemainingCount();
  const total = todos.length;
  const line = `완료: ${completed} · 남은 할 일: ${remaining} · 전체: ${total}`;

  if (todoStatsEl) {
    todoStatsEl.textContent = line;
  }
}

function addTodo() {
  if (!todoInput) return;
  const trimmed = todoInput.value.trim();
  if (!trimmed) return;

  todos.push({
    id: nextId(),
    text: trimmed,
    completed: false,
  });

  saveTodos();
  renderTodos();
  todoInput.value = "";
  todoInput.focus();
}

function toggleTodo(id) {
  const numId = Number(id);
  const todo = todos.find((t) => t.id === numId);
  if (!todo) return;
  todo.completed = !todo.completed;
  saveTodos();
  renderTodos();
}

function deleteTodo(id) {
  const numId = Number(id);
  todos = todos.filter((t) => t.id !== numId);
  saveTodos();
  renderTodos();
}

function renderTodos() {
  if (!todoList) return;

  todoList.innerHTML = "";

  todos.forEach((todo) => {
    const item = document.createElement("li");
    item.className = "todo-item";
    item.dataset.id = String(todo.id);
    if (todo.completed) {
      item.classList.add("todo-item--done");
    }

    const text = document.createElement("span");
    text.className = "todo-text";
    text.textContent = todo.text;
    if (todo.completed) {
      text.classList.add("completed");
    }

    const deleteButton = document.createElement("button");
    deleteButton.className = "delete-button";
    deleteButton.type = "button";
    deleteButton.textContent = "삭제";

    item.appendChild(text);
    item.appendChild(deleteButton);
    todoList.appendChild(item);
  });

  updateCount();
}

function initEventListeners() {
  addBtn?.addEventListener("click", () => {
    addTodo();
  });

  todoInput?.addEventListener("keydown", (event) => {
    if (event.key !== "Enter") return;
    event.preventDefault();
    addTodo();
  });

  todoList?.addEventListener("click", (event) => {
    const target = event.target;
    if (!(target instanceof Element)) return;

    const deleteBtn = target.closest(".delete-button");
    if (deleteBtn) {
      event.stopPropagation();
      const row = deleteBtn.closest(".todo-item");
      const id = row?.dataset.id;
      if (id != null) deleteTodo(id);
      return;
    }

    const textEl = target.closest(".todo-text");
    if (textEl) {
      const row = textEl.closest(".todo-item");
      const id = row?.dataset.id;
      if (id != null) toggleTodo(id);
    }
  });
}

loadTodos();
initEventListeners();
renderTodos();
