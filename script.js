const STORAGE_KEY = "todos";
const FILTER_STORAGE_KEY = "todo-filter";

/** @type {"all" | "active" | "completed"} */
let currentFilter = "all";

const VALID_FILTERS = new Set(["all", "active", "completed"]);

/** @type {{ id: number, text: string, completed: boolean }[]} */
let todos = [];

const todoInput = document.getElementById("todo-input");
const addBtn = document.getElementById("add-btn");
const todoList = document.getElementById("todo-list");
const todoCountCompletedEl = document.getElementById("todo-count-completed");
const todoCountRemainingEl = document.getElementById("todo-count-remaining");
const todoCountTotalEl = document.getElementById("todo-count-total");
const todoFilterBar = document.getElementById("todo-filter-bar");

function loadFilter() {
  try {
    const stored = localStorage.getItem(FILTER_STORAGE_KEY);
    if (stored && VALID_FILTERS.has(stored)) {
      currentFilter = /** @type {"all" | "active" | "completed"} */ (stored);
    } else {
      currentFilter = "all";
    }
  } catch {
    currentFilter = "all";
  }
}

function saveFilter() {
  try {
    localStorage.setItem(FILTER_STORAGE_KEY, currentFilter);
  } catch {
    /* ignore quota / private mode */
  }
}

function setFilter(mode) {
  if (!VALID_FILTERS.has(mode)) return;
  currentFilter = /** @type {"all" | "active" | "completed"} */ (mode);
  saveFilter();
  renderTodos();
}

function todosMatchingFilter() {
  if (currentFilter === "active") {
    return todos.filter((t) => !t.completed);
  }
  if (currentFilter === "completed") {
    return todos.filter((t) => t.completed);
  }
  return todos;
}

function syncFilterButtons() {
  if (!todoFilterBar) return;
  todoFilterBar.querySelectorAll(".filter-btn").forEach((btn) => {
    if (!(btn instanceof HTMLButtonElement)) return;
    const mode = btn.dataset.filter;
    const isActive = mode === currentFilter;
    btn.classList.toggle("filter-btn--active", isActive);
    btn.setAttribute("aria-pressed", isActive ? "true" : "false");
  });
}

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

  if (todoCountCompletedEl) {
    todoCountCompletedEl.textContent = `완료: ${completed}`;
  }
  if (todoCountRemainingEl) {
    todoCountRemainingEl.textContent = `남은 할 일: ${remaining}`;
  }
  if (todoCountTotalEl) {
    todoCountTotalEl.textContent = `전체: ${total}`;
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

  const visible = todosMatchingFilter();

  if (visible.length === 0) {
    const empty = document.createElement("li");
    empty.className = "todo-list-empty";
    empty.setAttribute("role", "status");
    if (todos.length === 0) {
      empty.textContent = "할 일이 없습니다.";
    } else if (currentFilter === "completed") {
      empty.textContent = "완료된 할 일이 없습니다.";
    } else {
      empty.textContent = "남은 할 일이 없습니다.";
    }
    todoList.appendChild(empty);
    updateCount();
    syncFilterButtons();
    return;
  }

  visible.forEach((todo) => {
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
  syncFilterButtons();
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

  todoFilterBar?.addEventListener("click", (event) => {
    const target = event.target;
    if (!(target instanceof Element)) return;
    const btn = target.closest("[data-filter]");
    if (!(btn instanceof HTMLButtonElement)) return;
    const mode = btn.dataset.filter;
    if (!mode || !VALID_FILTERS.has(mode)) return;
    setFilter(mode);
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
loadFilter();
initEventListeners();
renderTodos();
