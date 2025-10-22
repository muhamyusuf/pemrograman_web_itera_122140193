import { storage } from "./js/storage.js";
import { getSessionLabel } from "./js/task-utils.js";

const progressEl = document.querySelector("[data-task-progress]");
const remainingEl = document.querySelector("[data-task-remaining]");
const completedChipEl = document.querySelector("[data-task-completed]");
const listEl = document.querySelector("[data-task-list]");

const state = storage.load();
const tasks = state.tasks ?? [];

const total = tasks.length;
const completed = tasks.filter(({ completed }) => completed).length;
const ratio = total === 0 ? 0 : Math.round((completed / total) * 100);
const remaining = total - completed;

if (progressEl) {
  progressEl.textContent = `${ratio}% selesai`;
}

if (remainingEl) {
  remainingEl.textContent = `${remaining} tugas aktif`;
}

if (completedChipEl) {
  completedChipEl.textContent = `${completed} / ${total}`;
}

const renderTaskItem = (task) => {
  const item = document.createElement("li");
  item.className = "note-item";

  const title = document.createElement("p");
  title.textContent = task.title;

  const meta = document.createElement("span");
  meta.className = "note-item__time muted";
  const session = getSessionLabel(task.schedule);
  const schedule = task.schedule ?? "Tanpa jadwal";
  const statusText = task.completed ? "Selesai" : "Belum selesai";
  meta.textContent = `${session} - ${schedule} - ${statusText}`;

  const description = document.createElement("p");
  description.className = "muted";
  description.textContent = task.description;

  item.append(title, description, meta);
  if (task.completed) {
    item.style.borderColor = "hsl(var(--accent) / 0.4)";
  }
  return item;
};

if (listEl) {
  listEl.innerHTML = "";
  if (!tasks.length) {
    const empty = document.createElement("li");
    empty.className = "note-item";
    empty.innerHTML =
      '<p>Belum ada tugas.</p><span class="note-item__time muted">Tambah tugas dari dashboard utama.</span>';
    listEl.append(empty);
  } else {
    const sorted = [...tasks].sort((a, b) =>
      (a.schedule || "").localeCompare(b.schedule || "")
    );
    sorted.forEach((task) => listEl.append(renderTaskItem(task)));
  }
}
