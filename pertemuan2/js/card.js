const cloneTemplate = (templateId) => {
  const template = document.getElementById(templateId);
  if (!template) {
    throw new Error(`Template dengan id ${templateId} tidak ditemukan.`);
  }
  return template.content.firstElementChild.cloneNode(true);
};

const renderTaskItem = (task, handlers) => {
  const { id, title, description, schedule, completed } = task;
  const element = cloneTemplate("task-item");
  const checkbox = element.querySelector('input[type="checkbox"]');
  const titleEl = element.querySelector(".task-item__title");
  const descriptionEl = element.querySelector(".task-item__description");
  const scheduleEl = element.querySelector(".task-item__schedule");

  checkbox.checked = completed;
  titleEl.textContent = title;
  descriptionEl.textContent = description;
  scheduleEl.textContent = schedule ? `Jadwal: ${schedule}` : "Tanpa jadwal";

  checkbox.addEventListener("change", () =>
    handlers.onToggle(id, checkbox.checked)
  );
  element
    .querySelector('[data-action="edit-task"]')
    .addEventListener("click", () => {
      handlers.onEdit(task);
    });
  element
    .querySelector('[data-action="delete-task"]')
    .addEventListener("click", () => {
      handlers.onDelete(id);
    });

  return element;
};

const renderDeviceItem = ({ name, code, type, status, lastPing }) => {
  const element = cloneTemplate("device-item");
  const statusIndicator = element.querySelector(".device-item__status");
  const nameEl = element.querySelector(".device-item__name");
  const metaEl = element.querySelector(".device-item__meta");
  const tagEl = element.querySelector(".device-item__tag");

  statusIndicator.classList.toggle("is-online", status === "online");
  statusIndicator.classList.toggle("is-warning", status === "warning");
  nameEl.textContent = name;
  metaEl.textContent = `${code} - ${type}`;
  if (status === "online") {
    tagEl.textContent = "Aktif";
  } else if (status === "warning") {
    tagEl.textContent = "Perlu perhatian";
  } else {
    tagEl.textContent = `Delay - ${lastPing}`;
  }

  return element;
};

const renderNoteItem = ({ id, text, createdAt }, handlers) => {
  const element = cloneTemplate("note-item");
  element.dataset.id = id;
  element.querySelector("p").textContent = text;
  element.querySelector(".note-item__time").textContent = createdAt;
  element
    .querySelector('[data-action="delete-note"]')
    .addEventListener("click", () => {
      handlers.onDelete(id);
    });
  return element;
};

export { renderTaskItem, renderDeviceItem, renderNoteItem };
