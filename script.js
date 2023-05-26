const createTodo = (title, description, dueDate, priority) => {
  return {
    title,
    description,
    dueDate,
    priority,
  };
};

const createProject = (name) => {
  return {
    name,
    todos: [],
  };
};

const projectList = document.querySelector(".project-list");
const todoList = document.querySelector(".todo-list");
const projectForm = document.getElementById("project-form");
const todoForm = document.getElementById("todo-form");

let selectedProject = null;
let projects = [createProject("Default")];

const saveProjectsToLocalStorage = () => {
  localStorage.setItem("projects", JSON.stringify(projects));
};

const loadProjectsFromLocalStorage = () => {
  const savedProjects = localStorage.getItem("projects");
  if (savedProjects) {
    projects = JSON.parse(savedProjects);
    console.log({ projects });
    renderProjects();
  }
};

const renderProjects = () => {
  projectList.innerHTML = "";
  projects.forEach((project, index) => {
    const projectItem = document.createElement("li");
    projectItem.classList.add("project-item");
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

const renderTodos = () => {
  todoList.innerHTML = "";
  if (selectedProject) {
    const projectNameElement = document.createElement("h3");
    projectNameElement.textContent = selectedProject.name;
    todoList.appendChild(projectNameElement);

    selectedProject.todos.forEach((todo, index) => {
      const todoItem = document.createElement("li");
      todoItem.classList.add("todo-item");
      todoItem.innerHTML = `
        <span>${todo.title}</span>
        <span>${todo.dueDate}</span>
        <button class="delete-btn" onclick="deleteTodo(${index})">Delete</button>
      `;
      todoList.appendChild(todoItem);
    });
  }
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

const createNewTodo = (e) => {
  e.preventDefault();
  const title = document.getElementById("title").value;
  const description = document.getElementById("description").value;
  const dueDate = document.getElementById("due-date").value;
  const priority = document.getElementById("priority").value;

  if (selectedProject) {
    const newTodo = createTodo(title, description, dueDate, priority);
    selectedProject.todos.push(newTodo);
    renderTodos();
  } else {
    alert("Select a Project Before Adding a Todo");
    return;
  }

  saveProjectsToLocalStorage();

  document.getElementById("title").value = "";
  document.getElementById("description").value = "";
  document.getElementById("due-date").value = "";
  document.getElementById("priority").value = "low";
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

const deleteTodo = (index) => {
  selectedProject.todos.splice(index, 1);
  saveProjectsToLocalStorage();
  renderTodos();
};

projectForm.addEventListener("submit", createNewProject);
todoForm.addEventListener("submit", createNewTodo);
loadProjectsFromLocalStorage();
renderProjects();
