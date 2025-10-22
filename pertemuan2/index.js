import { runWithLoading } from "./js/button.js";
import { renderTaskItem, renderDeviceItem, renderNoteItem } from "./js/card.js";
import { fetchWeatherSnapshot, buildHealthSummary } from "./js/chart.js";
import { storage } from "./js/storage.js";
import { getDevices } from "./js/table.js";
import { buildTasksBySession } from "./js/task-utils.js";

const $ = (selector, scope = document) => scope.querySelector(selector);

const formatDate = (date) =>
  date.toLocaleDateString("id-ID", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

const formatTime = (date) =>
  date.toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" });

const generateId = (prefix = "id") =>
  `${prefix}-${crypto.randomUUID?.() ?? Date.now().toString(36)}`;

class Dashboard {
  constructor() {
    const { tasks = [], notes = [] } = storage.load();
    this.state = { tasks, notes };
    this.editingTaskId = null;

    this.elements = {
      addTaskButton: $('[data-action="add-task"]'),
      progressLabel: $("[data-progress-label]"),
      progressCount: $("[data-progress-count]"),
      progressFill: $("[data-progress-fill]"),
      taskList: $("[data-task-list]"),
      taskDialog: document.querySelector("[data-task-dialog]"),
      taskForm: document.querySelector("[data-task-form]"),
      dialogTitle: $("[data-dialog-title]"),
      notesForm: $("[data-notes-form]"),
      notesList: $("[data-notes-list]"),
      deviceList: $("[data-device-list]"),
      deviceCount: $("[data-device-count]"),
      sensorCount: $("[data-sensor-count]"),
      weatherCard: $("#weather-card"),
      healthScore: $("[data-health-score]"),
      healthMessage: $("[data-health-message]"),
      location: $("[data-location]"),
      currentDate: $("[data-current-date]"),
      currentTime: $("[data-current-time]"),
      refreshWeatherButton: $('[data-action="refresh-weather"]'),
    };

    this.taskHandlers = {
      onToggle: (id, completed) => this.toggleTask(id, completed),
      onEdit: (task) => this.openTaskDialog(task),
      onDelete: (id) => this.deleteTask(id),
    };

    this.noteHandlers = {
      onDelete: (id) => this.deleteNote(id),
    };

    this.registerEvents();
    this.renderDevices();
    this.renderTasks();
    this.renderNotes();
    this.refreshWeather();
    this.updateClock();
    setInterval(() => this.updateClock(), 1000 * 60);
  }

  registerEvents() {
    const {
      addTaskButton,
      taskDialog,
      taskForm,
      notesForm,
      refreshWeatherButton,
    } = this.elements;

    addTaskButton.addEventListener("click", () => this.openTaskDialog());
    taskDialog.addEventListener("cancel", () => this.closeTaskDialog());
    taskDialog
      .querySelector('[data-action="close-dialog"]')
      .addEventListener("click", () => this.closeTaskDialog());
    taskForm.addEventListener("submit", (event) =>
      this.handleTaskSubmit(event)
    );
    notesForm.addEventListener("submit", (event) =>
      this.handleNoteSubmit(event)
    );

    refreshWeatherButton.addEventListener("click", () =>
      runWithLoading(refreshWeatherButton, async () => {
        await this.refreshWeather();
      })
    );
  }

  openTaskDialog(task = { title: "", description: "", schedule: "" }) {
    const { taskDialog, taskForm, dialogTitle } = this.elements;
    const { title, description, schedule } = task;
    this.editingTaskId = task.id ?? null;
    dialogTitle.textContent = this.editingTaskId
      ? "Edit Tugas"
      : "Tambah Tugas";
    taskForm.elements.title.value = title;
    taskForm.elements.description.value = description;
    taskForm.elements.schedule.value = schedule ?? "";

    if (typeof taskDialog.showModal === "function") {
      taskDialog.showModal();
    }
  }

  closeTaskDialog() {
    const { taskDialog, taskForm } = this.elements;
    taskForm.reset();
    this.editingTaskId = null;
    if (taskDialog.open) {
      taskDialog.close();
    }
  }

  handleTaskSubmit(event) {
    event.preventDefault();
    const { taskForm } = this.elements;
    const formData = new FormData(taskForm);
    const { title, description, schedule } = Object.fromEntries(formData);
    const payload = { title, description, schedule };

    if (this.editingTaskId) {
      this.updateTask(this.editingTaskId, payload);
    } else {
      this.addTask({ ...payload, completed: false });
    }

    this.closeTaskDialog();
  }

  addTask(payload) {
    const newTask = { id: generateId("task"), ...payload };
    this.setState(({ tasks, ...rest }) => ({
      ...rest,
      tasks: [newTask, ...tasks],
    }));
  }

  updateTask(id, updates) {
    this.setState(({ tasks, ...rest }) => ({
      ...rest,
      tasks: tasks.map((task) =>
        task.id === id ? { ...task, ...updates } : task
      ),
    }));
  }

  toggleTask(id, completed) {
    this.updateTask(id, { completed });
  }

  deleteTask(id) {
    this.setState(({ tasks, ...rest }) => ({
      ...rest,
      tasks: tasks.filter((task) => task.id !== id),
    }));
  }

  handleNoteSubmit(event) {
    event.preventDefault();
    const textarea = event.currentTarget.elements.note;
    const text = textarea.value.trim();
    if (!text) return;

    const timestamp = new Date();
    const note = {
      id: generateId("note"),
      text,
      createdAt: `${formatDate(timestamp)} - ${formatTime(timestamp)}`,
    };

    this.setState(({ notes, ...rest }) => ({
      ...rest,
      notes: [note, ...notes],
    }));

    textarea.value = "";
  }

  deleteNote(id) {
    this.setState(({ notes, ...rest }) => ({
      ...rest,
      notes: notes.filter((note) => note.id !== id),
    }));
  }

  setState(updater) {
    this.state = storage.update((snapshot) => {
      const nextState =
        typeof updater === "function" ? updater(snapshot) : updater;
      return nextState;
    });
    this.renderTasks();
    this.renderNotes();
  }

  renderTasks() {
    const { taskList } = this.elements;
    taskList.innerHTML = "";
    this.state.tasks
      .map((task) => renderTaskItem(task, this.taskHandlers))
      .forEach((item) => taskList.append(item));
    this.updateProgress();
  }

  renderNotes() {
    const { notesList } = this.elements;
    notesList.innerHTML = "";
    this.state.notes
      .map((note) => renderNoteItem(note, this.noteHandlers))
      .forEach((item) => notesList.append(item));
  }

  updateProgress() {
    const { progressLabel, progressCount, progressFill } = this.elements;
    const { tasks } = this.state;
    const total = tasks.length;
    const completed = tasks.filter(({ completed }) => completed).length;
    const ratio = total === 0 ? 0 : Math.round((completed / total) * 100);

    progressLabel.textContent = `${ratio}% selesai`;
    progressCount.textContent = `${completed} dari ${total} tugas`;
    progressFill.style.width = `${ratio}%`;

    storage.update((snapshot) => {
      const nextTasks = snapshot.tasks ?? [];
      const analytics = snapshot.analytics ?? {};
      const summary = analytics.summary ?? {};
      return {
        ...snapshot,
        analytics: {
          ...analytics,
          summary: {
            ...summary,
            progressRatio: ratio,
            completedTasks: completed,
            totalTasks: total,
          },
          tasksBySession: buildTasksBySession(nextTasks),
        },
      };
    });
  }

  renderDevices() {
    const devices = getDevices();
    const { deviceList, deviceCount, sensorCount } = this.elements;
    deviceList.innerHTML = "";
    devices.forEach((device) =>
      deviceList.append(
        renderDeviceItem({
          name: device.name,
          code: `#${device.id}`,
          type: device.type,
          status: device.status,
          lastPing: device.lastPing,
        })
      )
    );
    const activeSensors = devices.filter(
      ({ type }) => type === "Sensor"
    ).length;
    deviceCount.textContent = `${devices.length} perangkat`;
    sensorCount.textContent = activeSensors.toString();
    this.healthPayload = devices;
    this.updateHealthSummary();
  }

  async refreshWeather() {
    const weather = await fetchWeatherSnapshot();
    const {
      temperature,
      condition,
      humidity,
      windSpeed,
      uvIndex,
      tempRange: { high, low },
    } = weather;

    $("[data-temperature]").textContent = `${temperature}\u00B0C`;
    $("[data-condition]").textContent = condition;
    $("[data-temp-range]").textContent = `H:${Math.round(
      high
    )}\u00B0C / L:${Math.round(low)}\u00B0C`;
    $("[data-humidity]").textContent = `${humidity}%`;
    $("[data-wind-speed]").textContent = `${windSpeed} m/s`;
    $("[data-uv-index]").textContent = uvIndex.toString();
  }

  updateClock() {
    const now = new Date();
    const { location, currentDate, currentTime } = this.elements;
    location.textContent = "Weilburg, Germany";
    currentDate.textContent = formatDate(now);
    currentTime.textContent = formatTime(now);
  }

  updateHealthSummary() {
    const summary = buildHealthSummary(this.healthPayload ?? []);
    const { healthScore, healthMessage } = this.elements;
    healthScore.textContent = `${summary.score}%`;
    healthMessage.textContent = summary.message;

    storage.update((snapshot) => {
      const analytics = snapshot.analytics ?? {};
      const summaryState = analytics.summary ?? {};
      return {
        ...snapshot,
        analytics: {
          ...analytics,
          summary: {
            ...summaryState,
            health: summary.score,
          },
        },
      };
    });
  }
}

const bootstrap = () => {
  new Dashboard();
};

document.addEventListener("DOMContentLoaded", bootstrap);
