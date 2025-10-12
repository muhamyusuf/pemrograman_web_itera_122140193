class TaskManager {
  constructor() {
    this.projects = [];
    this.currentProject = null;
    this.editingProject = null;
    this.editingColumn = null;
    this.editingTask = null;
    this.deleteCallback = null;
    this.draggedElement = null;
    this.draggedTask = null;
    this.draggedFromColumn = null;
    this.currentFilter = "all";
    this.currentSearch = "";

    this.init();
  }

  init() {
    this.loadFromLocalStorage();
    this.setupEventListeners();
    this.render();
  }

  setupEventListeners() {
    document
      .getElementById("addProjectBtn")
      .addEventListener("click", () => this.openProjectModal());
    document
      .getElementById("projectForm")
      .addEventListener("submit", (e) => this.handleProjectSubmit(e));
    document
      .getElementById("closeProjectModal")
      .addEventListener("click", () => this.closeModal("projectModal"));
    document
      .getElementById("cancelProjectBtn")
      .addEventListener("click", () => this.closeModal("projectModal"));

    document
      .getElementById("columnForm")
      .addEventListener("submit", (e) => this.handleColumnSubmit(e));
    document
      .getElementById("closeColumnModal")
      .addEventListener("click", () => this.closeModal("columnModal"));
    document
      .getElementById("cancelColumnBtn")
      .addEventListener("click", () => this.closeModal("columnModal"));

    document
      .getElementById("taskForm")
      .addEventListener("submit", (e) => this.handleTaskSubmit(e));
    document
      .getElementById("closeTaskModal")
      .addEventListener("click", () => this.closeModal("taskModal"));
    document
      .getElementById("cancelTaskBtn")
      .addEventListener("click", () => this.closeModal("taskModal"));

    document
      .getElementById("closeDeleteModal")
      .addEventListener("click", () => this.closeModal("deleteModal"));
    document
      .getElementById("cancelDeleteBtn")
      .addEventListener("click", () => this.closeModal("deleteModal"));
    document
      .getElementById("confirmDeleteBtn")
      .addEventListener("click", () => this.confirmDelete());

    document
      .getElementById("searchInput")
      .addEventListener("input", (e) => this.handleSearch(e.target.value));
    document
      .getElementById("filterStatus")
      .addEventListener("change", (e) => this.handleFilter(e.target.value));

    document.querySelectorAll(".modal").forEach((modal) => {
      modal.addEventListener("click", (e) => {
        if (e.target === modal) {
          this.closeModal(modal.id);
        }
      });
    });
  }

  loadFromLocalStorage() {
    const stored = localStorage.getItem("taskManagerData");
    if (stored) {
      const data = JSON.parse(stored);
      this.projects = data.projects || [];
      this.currentProject = data.currentProject || null;
    }
  }

  saveToLocalStorage() {
    const data = {
      projects: this.projects,
      currentProject: this.currentProject,
    };
    localStorage.setItem("taskManagerData", JSON.stringify(data));
  }

  openProjectModal(project = null) {
    this.editingProject = project;
    const modal = document.getElementById("projectModal");
    const title = document.getElementById("projectModalTitle");
    const nameInput = document.getElementById("projectName");
    const descInput = document.getElementById("projectDesc");

    if (project) {
      title.textContent = "Edit Project";
      nameInput.value = project.name;
      descInput.value = project.description || "";
    } else {
      title.textContent = "Tambah Project";
      nameInput.value = "";
      descInput.value = "";
    }

    this.clearFormErrors();
    modal.classList.add("active");
  }

  openColumnModal(column = null) {
    this.editingColumn = column;
    const modal = document.getElementById("columnModal");
    const title = document.getElementById("columnModalTitle");
    const nameInput = document.getElementById("columnName");

    if (column) {
      title.textContent = "Edit Kolom";
      nameInput.value = column.name;
    } else {
      title.textContent = "Tambah Kolom";
      nameInput.value = "";
    }

    this.clearFormErrors();
    modal.classList.add("active");
  }

  openTaskModal(columnId, task = null) {
    this.editingTask = task;
    this.editingColumnId = columnId;
    const modal = document.getElementById("taskModal");
    const title = document.getElementById("taskModalTitle");

    if (task) {
      title.textContent = "Edit Tugas";
      document.getElementById("taskName").value = task.name;
      document.getElementById("taskCourse").value = task.course;
      document.getElementById("taskDeadline").value = task.deadline;
      document.getElementById("taskDescription").value = task.description || "";
    } else {
      title.textContent = "Tambah Tugas";
      document.getElementById("taskName").value = "";
      document.getElementById("taskCourse").value = "";
      document.getElementById("taskDeadline").value = "";
      document.getElementById("taskDescription").value = "";
    }

    this.clearFormErrors();
    modal.classList.add("active");
  }

  openDeleteModal(message, callback) {
    document.getElementById("deleteMessage").textContent = message;
    this.deleteCallback = callback;
    document.getElementById("deleteModal").classList.add("active");
  }

  closeModal(modalId) {
    document.getElementById(modalId).classList.remove("active");
  }

  clearFormErrors() {
    document
      .querySelectorAll(".error-message")
      .forEach((el) => (el.textContent = ""));
  }

  validateProjectForm(name) {
    let isValid = true;
    const nameError = document.getElementById("projectNameError");

    if (!name.trim()) {
      nameError.textContent = "Nama project tidak boleh kosong";
      isValid = false;
    } else if (name.trim().length < 3) {
      nameError.textContent = "Nama project minimal 3 karakter";
      isValid = false;
    }

    return isValid;
  }

  validateColumnForm(name) {
    let isValid = true;
    const nameError = document.getElementById("columnNameError");

    if (!name.trim()) {
      nameError.textContent = "Nama kolom tidak boleh kosong";
      isValid = false;
    } else if (name.trim().length < 2) {
      nameError.textContent = "Nama kolom minimal 2 karakter";
      isValid = false;
    }

    return isValid;
  }

  validateTaskForm(name, course, deadline) {
    let isValid = true;

    const nameError = document.getElementById("taskNameError");
    const courseError = document.getElementById("taskCourseError");
    const deadlineError = document.getElementById("taskDeadlineError");

    if (!name.trim()) {
      nameError.textContent = "Nama tugas tidak boleh kosong";
      isValid = false;
    } else if (name.trim().length < 3) {
      nameError.textContent = "Nama tugas minimal 3 karakter";
      isValid = false;
    }

    if (!course.trim()) {
      courseError.textContent = "Mata kuliah tidak boleh kosong";
      isValid = false;
    }

    if (!deadline) {
      deadlineError.textContent = "Deadline tidak boleh kosong";
      isValid = false;
    } else {
      const deadlineDate = new Date(deadline);
      const now = new Date();
      if (deadlineDate < now) {
        deadlineError.textContent = "Deadline tidak boleh di masa lalu";
        isValid = false;
      }
    }

    return isValid;
  }

  handleProjectSubmit(e) {
    e.preventDefault();

    const name = document.getElementById("projectName").value;
    const description = document.getElementById("projectDesc").value;

    if (!this.validateProjectForm(name)) return;

    if (this.editingProject) {
      this.editingProject.name = name.trim();
      this.editingProject.description = description.trim();
    } else {
      const project = {
        id: Date.now().toString(),
        name: name.trim(),
        description: description.trim(),
        columns: [
          { id: "col1", name: "To Do", tasks: [] },
          { id: "col2", name: "In Progress", tasks: [] },
          { id: "col3", name: "Done", tasks: [] },
        ],
        createdAt: new Date().toISOString(),
      };
      this.projects.push(project);
      this.currentProject = project.id;
    }

    this.saveToLocalStorage();
    this.render();
    this.closeModal("projectModal");
  }

  handleColumnSubmit(e) {
    e.preventDefault();

    const name = document.getElementById("columnName").value;

    if (!this.validateColumnForm(name)) return;

    const project = this.projects.find((p) => p.id === this.currentProject);
    if (!project) return;

    if (this.editingColumn) {
      this.editingColumn.name = name.trim();
    } else {
      const column = {
        id: Date.now().toString(),
        name: name.trim(),
        tasks: [],
      };
      project.columns.push(column);
    }

    this.saveToLocalStorage();
    this.render();
    this.closeModal("columnModal");
  }

  handleTaskSubmit(e) {
    e.preventDefault();

    const name = document.getElementById("taskName").value;
    const course = document.getElementById("taskCourse").value;
    const deadline = document.getElementById("taskDeadline").value;
    const description = document.getElementById("taskDescription").value;

    if (!this.validateTaskForm(name, course, deadline)) return;

    const project = this.projects.find((p) => p.id === this.currentProject);
    if (!project) return;

    const column = project.columns.find((c) => c.id === this.editingColumnId);
    if (!column) return;

    if (this.editingTask) {
      this.editingTask.name = name.trim();
      this.editingTask.course = course.trim();
      this.editingTask.deadline = deadline;
      this.editingTask.description = description.trim();
    } else {
      const task = {
        id: Date.now().toString(),
        name: name.trim(),
        course: course.trim(),
        deadline: deadline,
        description: description.trim(),
        createdAt: new Date().toISOString(),
      };
      column.tasks.push(task);
    }

    this.saveToLocalStorage();
    this.render();
    this.closeModal("taskModal");
  }

  confirmDelete() {
    if (this.deleteCallback) {
      this.deleteCallback();
      this.deleteCallback = null;
    }
    this.closeModal("deleteModal");
  }

  selectProject(projectId) {
    this.currentProject = projectId;
    this.currentFilter = "all";
    this.currentSearch = "";
    document.getElementById("searchInput").value = "";
    document.getElementById("filterStatus").value = "all";
    this.saveToLocalStorage();
    this.render();
  }

  deleteProject(projectId) {
    this.openDeleteModal(
      "Apakah Anda yakin ingin menghapus project ini beserta semua data di dalamnya?",
      () => {
        this.projects = this.projects.filter((p) => p.id !== projectId);
        if (this.currentProject === projectId) {
          this.currentProject = null;
        }
        this.saveToLocalStorage();
        this.render();
      }
    );
  }

  deleteColumn(columnId) {
    const project = this.projects.find((p) => p.id === this.currentProject);
    if (!project) return;

    this.openDeleteModal(
      "Apakah Anda yakin ingin menghapus kolom ini beserta semua tugasnya?",
      () => {
        project.columns = project.columns.filter((c) => c.id !== columnId);
        this.saveToLocalStorage();
        this.render();
      }
    );
  }

  deleteTask(columnId, taskId) {
    const project = this.projects.find((p) => p.id === this.currentProject);
    if (!project) return;

    const column = project.columns.find((c) => c.id === columnId);
    if (!column) return;

    this.openDeleteModal("Apakah Anda yakin ingin menghapus tugas ini?", () => {
      column.tasks = column.tasks.filter((t) => t.id !== taskId);
      this.saveToLocalStorage();
      this.render();
    });
  }

  handleSearch(query) {
    this.currentSearch = query.toLowerCase();
    this.applyFilters();
  }

  handleFilter(status) {
    this.currentFilter = status;
    this.applyFilters();
  }

  applyFilters() {
    const project = this.projects.find((p) => p.id === this.currentProject);
    if (!project) return;

    const columns = document.querySelectorAll(".kanban-column[data-column-id]");
    const searchLower = this.currentSearch;

    columns.forEach((col) => {
      const columnId = col.dataset.columnId;
      const columnName = col.dataset.columnName;

      if (!columnId) {
        col.style.display = "none";
        return;
      }

      let showColumn = true;

      if (this.currentFilter !== "all") {
        showColumn = columnId === this.currentFilter;
      }

      if (showColumn && searchLower) {
        const tasks = col.querySelectorAll(".task-card");
        let hasVisibleTask = false;

        tasks.forEach((card) => {
          const taskName = card
            .querySelector(".task-card-title")
            .textContent.toLowerCase();
          const taskCourse = card
            .querySelector(".task-card-course")
            .textContent.toLowerCase();

          if (
            taskName.includes(searchLower) ||
            taskCourse.includes(searchLower)
          ) {
            card.style.display = "";
            hasVisibleTask = true;
          } else {
            card.style.display = "none";
          }
        });

        showColumn = hasVisibleTask;
      } else if (showColumn) {
        const tasks = col.querySelectorAll(".task-card");
        tasks.forEach((card) => {
          card.style.display = "";
        });
      }

      col.style.display = showColumn ? "" : "none";
    });
  }

  setupDragAndDrop() {
    const taskCards = document.querySelectorAll(".task-card");
    const columnTasks = document.querySelectorAll(".kanban-column-tasks");

    taskCards.forEach((card) => {
      card.draggable = true;

      card.addEventListener("dragstart", (e) => {
        this.draggedElement = card;
        const taskId = card.dataset.taskId;
        const columnId = card.dataset.columnId;

        const project = this.projects.find((p) => p.id === this.currentProject);
        const column = project.columns.find((c) => c.id === columnId);
        this.draggedTask = column.tasks.find((t) => t.id === taskId);
        this.draggedFromColumn = column;

        card.classList.add("dragging");
        e.dataTransfer.effectAllowed = "move";
      });

      card.addEventListener("dragend", () => {
        card.classList.remove("dragging");
        this.draggedElement = null;
        this.draggedTask = null;
        this.draggedFromColumn = null;
      });
    });

    columnTasks.forEach((container) => {
      container.addEventListener("dragover", (e) => {
        e.preventDefault();
        e.dataTransfer.dropEffect = "move";

        const afterElement = this.getDragAfterElement(container, e.clientY);
        const dragging = document.querySelector(".dragging");

        if (afterElement == null) {
          container.appendChild(dragging);
        } else {
          container.insertBefore(dragging, afterElement);
        }
      });

      container.addEventListener("drop", (e) => {
        e.preventDefault();

        if (!this.draggedTask || !this.draggedFromColumn) return;

        const targetColumnId =
          container.closest(".kanban-column").dataset.columnId;
        const project = this.projects.find((p) => p.id === this.currentProject);
        const targetColumn = project.columns.find(
          (c) => c.id === targetColumnId
        );

        if (this.draggedFromColumn.id !== targetColumn.id) {
          this.draggedFromColumn.tasks = this.draggedFromColumn.tasks.filter(
            (t) => t.id !== this.draggedTask.id
          );
          targetColumn.tasks.push(this.draggedTask);

          this.saveToLocalStorage();
          this.render();
        }
      });
    });
  }

  getDragAfterElement(container, y) {
    const draggableElements = [
      ...container.querySelectorAll(".task-card:not(.dragging)"),
    ];

    return draggableElements.reduce(
      (closest, child) => {
        const box = child.getBoundingClientRect();
        const offset = y - box.top - box.height / 2;

        if (offset < 0 && offset > closest.offset) {
          return { offset: offset, element: child };
        } else {
          return closest;
        }
      },
      { offset: Number.NEGATIVE_INFINITY }
    ).element;
  }

  getUncompletedTaskCount() {
    const project = this.projects.find((p) => p.id === this.currentProject);
    if (!project) return 0;

    const doneColumn = project.columns.find(
      (c) => c.name.toLowerCase() === "done"
    );
    if (!doneColumn) return 0;

    let total = 0;
    project.columns.forEach((col) => {
      if (col.id !== doneColumn.id) {
        total += col.tasks.length;
      }
    });

    return total;
  }

  formatDeadline(deadline) {
    const date = new Date(deadline);
    const now = new Date();
    const diffTime = date - now;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    const options = {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    };
    const formatted = date.toLocaleDateString("id-ID", options);

    let className = "";
    if (diffDays < 0) {
      className = "overdue";
    } else if (diffDays === 0) {
      className = "today";
    }

    return { formatted, className };
  }

  renderProjects() {
    const projectList = document.getElementById("projectList");

    if (this.projects.length === 0) {
      projectList.innerHTML =
        '<div class="empty-state" style="height: auto; padding: 2rem 0;"><p>Belum ada project</p></div>';
      return;
    }

    projectList.innerHTML = this.projects
      .map(
        (project) => `
            <div class="project-item ${
              project.id === this.currentProject ? "active" : ""
            }" data-id="${project.id}">
                <div class="project-item-header">
                    <span class="project-item-name">${this.escapeHtml(
                      project.name
                    )}</span>
                    <div class="project-item-actions">
                        <button class="btn btn-icon btn-sm btn-secondary edit-project" data-id="${
                          project.id
                        }" title="Edit">
                            <span class="icon">✎</span>
                        </button>
                        <button class="btn btn-icon btn-sm btn-destructive delete-project" data-id="${
                          project.id
                        }" title="Hapus">
                            <span class="icon">×</span>
                        </button>
                    </div>
                </div>
                ${
                  project.description
                    ? `<div class="project-item-desc">${this.escapeHtml(
                        project.description
                      )}</div>`
                    : ""
                }
            </div>
        `
      )
      .join("");

    document.querySelectorAll(".project-item").forEach((item) => {
      item.addEventListener("click", (e) => {
        if (!e.target.closest("button")) {
          this.selectProject(item.dataset.id);
        }
      });
    });

    document.querySelectorAll(".edit-project").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        e.stopPropagation();
        const project = this.projects.find((p) => p.id === btn.dataset.id);
        this.openProjectModal(project);
      });
    });

    document.querySelectorAll(".delete-project").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        e.stopPropagation();
        this.deleteProject(btn.dataset.id);
      });
    });
  }

  renderKanban() {
    const kanbanBoard = document.getElementById("kanbanBoard");
    const project = this.projects.find((p) => p.id === this.currentProject);

    if (!project) {
      kanbanBoard.innerHTML =
        '<div class="empty-state"><p>Pilih atau buat project untuk memulai</p></div>';
      document.getElementById("projectTitle").textContent = "Pilih Project";
      document.getElementById("taskCount").textContent =
        "0 tugas belum selesai";
      this.updateFilterDropdown([]);
      return;
    }

    document.getElementById("projectTitle").textContent = project.name;
    document.getElementById(
      "taskCount"
    ).textContent = `${this.getUncompletedTaskCount()} tugas belum selesai`;

    this.updateFilterDropdown(project.columns);

    kanbanBoard.innerHTML =
      project.columns
        .map(
          (column) => `
            <div class="kanban-column" data-column-id="${
              column.id
            }" data-column-name="${this.escapeHtml(column.name)}">
                <div class="kanban-column-header">
                    <div class="kanban-column-title">
                        ${this.escapeHtml(column.name)}
                        <span class="kanban-column-count">${
                          column.tasks.length
                        }</span>
                    </div>
                    <div class="kanban-column-actions">
                        <button class="btn btn-icon btn-sm btn-secondary edit-column" data-id="${
                          column.id
                        }" title="Edit">
                            <span class="icon">✎</span>
                        </button>
                        <button class="btn btn-icon btn-sm btn-destructive delete-column" data-id="${
                          column.id
                        }" title="Hapus">
                            <span class="icon">×</span>
                        </button>
                    </div>
                </div>
                <div class="kanban-column-tasks">
                    ${column.tasks
                      .map((task) => {
                        const deadline = this.formatDeadline(task.deadline);
                        return `
                            <div class="task-card" draggable="true" data-task-id="${
                              task.id
                            }" data-column-id="${column.id}">
                                <div class="task-card-header">
                                    <div class="task-card-title">${this.escapeHtml(
                                      task.name
                                    )}</div>
                                    <div class="task-card-actions">
                                        <button class="btn btn-icon btn-sm btn-secondary edit-task" data-column-id="${
                                          column.id
                                        }" data-task-id="${
                          task.id
                        }" title="Edit">
                                            <span class="icon">✎</span>
                                        </button>
                                        <button class="btn btn-icon btn-sm btn-destructive delete-task" data-column-id="${
                                          column.id
                                        }" data-task-id="${
                          task.id
                        }" title="Hapus">
                                            <span class="icon">×</span>
                                        </button>
                                    </div>
                                </div>
                                <div class="task-card-course">${this.escapeHtml(
                                  task.course
                                )}</div>
                                ${
                                  task.description
                                    ? `<div class="task-card-description">${this.escapeHtml(
                                        task.description
                                      )}</div>`
                                    : ""
                                }
                                <div class="task-card-footer">
                                    <div class="task-card-deadline ${
                                      deadline.className
                                    }">
                                        <span class="icon">📅</span>
                                        ${deadline.formatted}
                                    </div>
                                </div>
                            </div>
                        `;
                      })
                      .join("")}
                </div>
                <div class="kanban-column-footer">
                    <button class="btn btn-sm btn-secondary btn-full add-task" data-column-id="${
                      column.id
                    }">
                        <span class="icon">+</span>
                        Tambah Tugas
                    </button>
                </div>
            </div>
        `
        )
        .join("") +
      `
            <div class="kanban-column" style="min-height: 200px; display: flex; align-items: center; justify-content: center;">
                <button class="btn btn-primary" id="addColumnBtn">
                    <span class="icon">+</span>
                    Tambah Kolom
                </button>
            </div>
        `;

    document
      .getElementById("addColumnBtn")
      .addEventListener("click", () => this.openColumnModal());

    document.querySelectorAll(".edit-column").forEach((btn) => {
      btn.addEventListener("click", () => {
        const column = project.columns.find((c) => c.id === btn.dataset.id);
        this.openColumnModal(column);
      });
    });

    document.querySelectorAll(".delete-column").forEach((btn) => {
      btn.addEventListener("click", () => {
        this.deleteColumn(btn.dataset.id);
      });
    });

    document.querySelectorAll(".add-task").forEach((btn) => {
      btn.addEventListener("click", () => {
        this.openTaskModal(btn.dataset.columnId);
      });
    });

    document.querySelectorAll(".edit-task").forEach((btn) => {
      btn.addEventListener("click", () => {
        const column = project.columns.find(
          (c) => c.id === btn.dataset.columnId
        );
        const task = column.tasks.find((t) => t.id === btn.dataset.taskId);
        this.openTaskModal(btn.dataset.columnId, task);
      });
    });

    document.querySelectorAll(".delete-task").forEach((btn) => {
      btn.addEventListener("click", () => {
        this.deleteTask(btn.dataset.columnId, btn.dataset.taskId);
      });
    });

    this.setupDragAndDrop();
    this.applyFilters();
  }

  updateFilterDropdown(columns) {
    const filterSelect = document.getElementById("filterStatus");
    const currentValue = filterSelect.value;

    filterSelect.innerHTML = '<option value="all">Semua Status</option>';

    columns.forEach((column) => {
      const option = document.createElement("option");
      option.value = column.id;
      option.textContent = column.name;
      option.dataset.columnName = column.name.toLowerCase();
      filterSelect.appendChild(option);
    });

    const optionExists = Array.from(filterSelect.options).some(
      (opt) => opt.value === currentValue
    );
    if (optionExists) {
      filterSelect.value = currentValue;
    } else {
      filterSelect.value = "all";
      this.currentFilter = "all";
    }
  }

  render() {
    this.renderProjects();
    this.renderKanban();
  }

  escapeHtml(text) {
    const div = document.createElement("div");
    div.textContent = text;
    return div.innerHTML;
  }
}

document.addEventListener("DOMContentLoaded", () => {
  new TaskManager();
});
