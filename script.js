const createElement = (tag, className, innerText) => {
  const element = document.createElement(tag);
  if (className) {
    element.classList.add(className);
  }
  element.innerText = innerText;
  return element;
};

const clearElement = (element) => {
  element.innerHTML = "";
};

const saveToLocalStorage = (key, data) => {
  localStorage.setItem(key, JSON.stringify(data));
};

const loadProjectsFromLocalStorage = (key) => {
  const data = localStorage.getItem(key);
  return data ? JSON.parse(data) : null;
};

const createTodo = (title, description, dueDate, priority) => {
  return { title, description, dueDate, priority };
};

const deleteTodo = (index) => {
  selectedProject.todos.splice(index, 1);
  saveProjectsToLocalStorage();
  renderTodos();
};

const renderTodos = () => {
  clearElement(todoList);

  if (selectedProject) {
    const projectNameElement = createElement("h3", "", selectedProject.name);
    todoList.appendChild(projectNameElement);

    selectedProject.todos.forEach((todo, index) => {
      const todoItem = createElement("li", "todo-item", "");
      todoItem.innerHTML = `
      <span>${todo.title}</span>
      <span>${todo.dueDate}</span>
      <button class="delete-btn" onclick="deleteTodo(${index})">Delete</button>
    `;
      todoList.appendChild(todoItem);

      todoList.appendChild(todoItem);
    });
  }
};

const createNewTodo = (e) => {
  e.preventDefault();

  const title = document.getElementById("title").value;
  const description = document.getElementById("description").value;
  const dueDate = document.getElementById("due-date").value;
  const priority = document.getElementById("priority").value;

  if (!selectedProject) {
    alert("Select a Project Before Adding a Todo");
    return;
  }

  const newTodo = createTodo(title, description, dueDate, priority);
  selectedProject.todos.push(newTodo);
  saveProjectsToLocalStorage();
  renderTodos();

  document.getElementById("title").value = "";
  document.getElementById("description").value = "";
  document.getElementById("due-date").value = "";
  document.getElementById("priority").value = "low";
};

const createProject = (name) => {
  return { name, todos: [] };
};

const deleteProject = (index) => {
  projects.splice(index, 1);

  if (selectedProject === projects[index]) {
    selectedProject = null;
  }

  saveProjectsToLocalStorage();
  renderProjects();
  renderTodos();
};

const renderProjects = () => {
  clearElement(projectList);

  projects.forEach((project, index) => {
    const projectItem = createElement("li", "project-item", "");

    if (project === selectedProject) {
      projectItem.classList.add("active");
    }

    projectItem.innerHTML = `
    <span class="project-name">${project.name}</span>
    <button class="delete-btn" onclick="deleteProject(${index})">Delete</button>
  `;

    projectItem.addEventListener("click", () => {
      selectedProject = selectedProject === project ? null : project;
      renderProjects();
      renderTodos();
    });
    projectList.appendChild(projectItem);
  });
};

const createNewProject = (e) => {
  e.preventDefault();
  const projectName = document.getElementById("project").value;
  const newProject = createProject(projectName);
  projects.push(newProject);
  renderProjects();
  document.getElementById("project").value = "";
  saveProjectsToLocalStorage();
};

const projectList = document.querySelector(".project-list");
const todoList = document.querySelector(".todo-list");
const projectForm = document.getElementById("project-form");
const todoForm = document.getElementById("todo-form");

let selectedProject = null;
let projects = loadProjectsFromLocalStorage("projects") || [
  createProject("Default"),
];

const saveProjectsToLocalStorage = () => {
  saveToLocalStorage("projects", projects);
};

projectForm.addEventListener("submit", createNewProject);
todoForm.addEventListener("submit", createNewTodo);
loadProjectsFromLocalStorage();
renderProjects();
