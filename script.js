let todos = [];

const todoInput = document.getElementById("todoInput");
const addButton = document.getElementById("addButton");
const todoList = document.getElementById("todoList");
const todoCount = document.getElementById("todoCount");

function loadTodos() {
  try {
    const stored = localStorage.getItem("todos");
    if (!stored) {
      todos = [];
      return;
    }

    const parsed = JSON.parse(stored);
    todos = Array.isArray(parsed) ? parsed : [];
  } catch (error) {
    todos = [];
  }
}

function saveTodos() {
  localStorage.setItem("todos", JSON.stringify(todos));
}

function addTodo(text) {
  if (!Array.isArray(todos)) {
    todos = [];
  }

  if (typeof text !== "string") {
    return;
  }

  const trimmed = text.trim();
  if (!trimmed) {
    return;
  }

  todos.push({
    id: Date.now() + Math.floor(Math.random() * 1000),
    text: trimmed,
    completed: false,
  });

  saveTodos();
  renderTodos();
}

function toggleTodo(id) {
  if (!Array.isArray(todos) || typeof id !== "number") {
    return;
  }

  todos = todos.map((todo) => {
    if (todo.id === id) {
      return { ...todo, completed: !todo.completed };
    }
    return todo;
  });

  saveTodos();
  renderTodos();
}

function deleteTodo(id) {
  if (!Array.isArray(todos) || typeof id !== "number") {
    return;
  }

  todos = todos.filter((todo) => todo.id !== id);
  saveTodos();
  renderTodos();
}

function updateCount() {
  if (!Array.isArray(todos)) {
    todoCount.textContent = "남은 할 일: 0";
    return;
  }

  const remaining = todos.filter((todo) => !todo.completed).length;
  todoCount.textContent = `남은 할 일: ${remaining}`;
}

function renderTodos() {
  if (!todoList) {
    return;
  }

  todoList.innerHTML = "";

  if (!Array.isArray(todos)) {
    todos = [];
  }

  todos.forEach((todo) => {
    const item = document.createElement("li");
    item.className = "todo-item";

    const text = document.createElement("span");
    text.className = "todo-text";
    if (todo.completed) {
      text.classList.add("completed");
    }
    text.textContent = todo.text;
    text.addEventListener("click", () => toggleTodo(todo.id));

    const deleteButton = document.createElement("button");
    deleteButton.className = "delete-button";
    deleteButton.type = "button";
    deleteButton.textContent = "삭제";
    deleteButton.addEventListener("click", () => deleteTodo(todo.id));

    item.appendChild(text);
    item.appendChild(deleteButton);
    todoList.appendChild(item);
  });

  updateCount();
}

addButton.addEventListener("click", () => {
  addTodo(todoInput.value);
  todoInput.value = "";
  todoInput.focus();
});

todoInput.addEventListener("keydown", (event) => {
  if (event.key !== "Enter") {
    return;
  }

  addTodo(todoInput.value);
  todoInput.value = "";
});

loadTodos();
renderTodos();
