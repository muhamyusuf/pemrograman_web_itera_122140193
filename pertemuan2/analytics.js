import { storage } from "./js/storage.js";
import { buildHealthSummary } from "./js/chart.js";
import { buildTasksBySession } from "./js/task-utils.js";

const ICON_EDIT =
  '<svg viewBox="0 0 24 24" focusable="false"><path d="M5 17.59V21h3.41L19 10.41l-3.41-3.41L5 17.59Zm14.71-9.88a1 1 0 0 0 0-1.41l-2-2a1 1 0 0 0-1.41 0L14.13 6.5l3.41 3.41 2.17-2.2Z"/></svg>';
const ICON_DELETE =
  '<svg viewBox="0 0 24 24" focusable="false"><path d="M6 7h12v13a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2V7Zm3-4h6l1 2h4v2H4V5h4l1-2Z"/></svg>';

const timeFormatter = new Intl.DateTimeFormat("id-ID", {
  hour: "2-digit",
  minute: "2-digit",
});

const getColorToken = (token) =>
  `hsl(${getComputedStyle(document.documentElement)
    .getPropertyValue(token)
    .trim()})`;

const generateId = (prefix = "id") =>
  `${prefix}-${crypto.randomUUID?.() ?? Date.now().toString(36)}`;

const defaultTrendSeed = [
  { label: "Sen", value: 48 },
  { label: "Sel", value: 52 },
  { label: "Rab", value: 55 },
  { label: "Kam", value: 51 },
  { label: "Jum", value: 57 },
  { label: "Sab", value: 60 },
  { label: "Min", value: 54 },
];

const alertForm = document.querySelector("[data-alert-form]");
const trendForm = document.querySelector("[data-trend-form]");
const alertListEl = document.querySelector("[data-analytics-alerts]");
const trendListEl = document.querySelector("[data-trend-list]");
const chartCanvas = document.getElementById("productivity-chart");
const healthValueEl = document.querySelector("[data-analytics-health]");
const uptimeEl = document.querySelector("[data-analytics-uptime]");
const healthMessageEl = document.querySelector(
  "[data-analytics-health-message]"
);
const alertCountEl = document.querySelector("[data-analytics-alert-count]");
const progressChipEl = document.querySelector("[data-analytics-task-progress]");
const taskCountEl = document.querySelector("[data-analytics-task-count]");
const taskSessionsEl = document.querySelector("[data-analytics-task-sessions]");

const normalizeTrendEntries = () => {
  storage.update((snapshot) => {
    const analytics = snapshot.analytics ?? {};
    const currentTrend = analytics.productivityTrend ?? [];
    let changed = false;
    const normalized = currentTrend.map((entry) => {
      if (entry.id) return entry;
      changed = true;
      return { ...entry, id: generateId("trend") };
    });
    if (!analytics.productivityTrend && !normalized.length) {
      changed = true;
      normalized.push(
        ...defaultTrendSeed.map((entry) => ({
          ...entry,
          id: generateId("trend"),
        }))
      );
    }
    if (!changed) return snapshot;
    return {
      ...snapshot,
      analytics: {
        ...analytics,
        productivityTrend: normalized,
      },
    };
  });
};

normalizeTrendEntries();

const getState = () => {
  const snapshot = storage.load();
  const analytics = snapshot.analytics ?? {};
  const tasks = snapshot.tasks ?? [];
  const devices = snapshot.devices ?? [];
  const alerts = analytics.alerts ?? [];
  const trend = analytics.productivityTrend ?? [];
  const summary = analytics.summary ?? {};

  const totalTasks = summary.totalTasks ?? tasks.length;
  const completedTasks =
    summary.completedTasks ?? tasks.filter(({ completed }) => completed).length;
  const progressRatio =
    summary.progressRatio ??
    (totalTasks === 0 ? 0 : Math.round((completedTasks / totalTasks) * 100));

  const sessions =
    analytics.tasksBySession && analytics.tasksBySession.length
      ? analytics.tasksBySession
      : buildTasksBySession(tasks);

  return {
    snapshot,
    analytics,
    alerts,
    trend,
    summary,
    tasks,
    devices,
    metrics: { totalTasks, completedTasks, progressRatio, sessions },
  };
};

const updateAnalytics = (updater) => {
  return storage.update((snapshot) => {
    const analytics = snapshot.analytics ?? {};
    const nextAnalytics = updater({ ...analytics }, snapshot);
    return {
      ...snapshot,
      analytics: nextAnalytics,
    };
  });
};

const renderAlerts = (alerts) => {
  if (!alertListEl) return;
  alertListEl.innerHTML = "";

  if (!alerts.length) {
    const empty = document.createElement("li");
    empty.className = "note-item";
    empty.innerHTML =
      '<p>Tidak ada alert aktif.</p><span class="note-item__time muted">Semua sensor stabil.</span>';
    alertListEl.append(empty);
    return;
  }

  alerts.forEach((alert) => {
    const item = document.createElement("li");
    item.className = "note-item";
    item.dataset.id = alert.id;

    const header = document.createElement("div");
    header.className = "trend-item__header";

    const title = document.createElement("p");
    title.textContent = alert.title;

    const actions = document.createElement("div");
    actions.className = "analytics-alert-actions";

    const editButton = document.createElement("button");
    editButton.className = "icon-button";
    editButton.type = "button";
    editButton.dataset.action = "edit-alert";
    editButton.dataset.id = alert.id;
    editButton.setAttribute("aria-label", "Edit alert");
    editButton.innerHTML = ICON_EDIT;

    const deleteButton = document.createElement("button");
    deleteButton.className = "icon-button";
    deleteButton.type = "button";
    deleteButton.dataset.action = "delete-alert";
    deleteButton.dataset.id = alert.id;
    deleteButton.setAttribute("aria-label", "Hapus alert");
    deleteButton.innerHTML = ICON_DELETE;

    actions.append(editButton, deleteButton);
    header.append(title, actions);

    const meta = document.createElement("span");
    meta.className = "note-item__time muted";
    meta.textContent = `${alert.message} - ${alert.timestamp ?? "-"}`;

    item.append(header, meta);
    alertListEl.append(item);
  });
};

const renderTaskSessions = (sessions) => {
  if (!taskSessionsEl) return;
  taskSessionsEl.innerHTML = "";

  sessions.forEach((session) => {
    const item = document.createElement("li");
    item.className = "note-item";
    const title = document.createElement("p");
    title.textContent = session.label;
    const meta = document.createElement("span");
    meta.className = "note-item__time muted";
    meta.textContent = `${session.value} tugas`;
    item.append(title, meta);
    taskSessionsEl.append(item);
  });
};

const renderTrendList = (trend) => {
  if (!trendListEl) return;
  trendListEl.innerHTML = "";

  if (!trend.length) {
    const empty = document.createElement("li");
    empty.className = "trend-item";
    empty.innerHTML =
      '<div class="trend-item__header"><strong>Belum ada data</strong></div><span class="note-item__time muted">Tambah data produktivitas dengan formulir di atas.</span>';
    trendListEl.append(empty);
    return;
  }

  trend.forEach((entry) => {
    const item = document.createElement("li");
    item.className = "trend-item";
    item.dataset.id = entry.id;

    const header = document.createElement("div");
    header.className = "trend-item__header";

    const title = document.createElement("strong");
    title.textContent = entry.label;

    const actions = document.createElement("div");
    actions.className = "trend-item__actions";

    const editButton = document.createElement("button");
    editButton.className = "icon-button";
    editButton.type = "button";
    editButton.dataset.action = "edit-trend";
    editButton.dataset.id = entry.id;
    editButton.setAttribute("aria-label", "Edit data produktivitas");
    editButton.innerHTML = ICON_EDIT;

    const deleteButton = document.createElement("button");
    deleteButton.className = "icon-button";
    deleteButton.type = "button";
    deleteButton.dataset.action = "delete-trend";
    deleteButton.dataset.id = entry.id;
    deleteButton.setAttribute("aria-label", "Hapus data produktivitas");
    deleteButton.innerHTML = ICON_DELETE;

    actions.append(editButton, deleteButton);
    header.append(title, actions);

    const meta = document.createElement("span");
    meta.className = "note-item__time muted";
    meta.textContent = `${entry.value} kg`;

    item.append(header, meta);
    trendListEl.append(item);
  });
};

const renderProductivityChart = (dataset) => {
  if (!chartCanvas) return;
  const ctx = chartCanvas.getContext("2d");
  if (!ctx) return;

  const dpr = window.devicePixelRatio || 1;
  const rect = chartCanvas.getBoundingClientRect();
  const width = rect.width || 600;
  const height = rect.height || 260;
  chartCanvas.width = width * dpr;
  chartCanvas.height = height * dpr;
  ctx.scale(dpr, dpr);
  ctx.clearRect(0, 0, width, height);

  if (!dataset.length) {
    ctx.fillStyle = getColorToken("--muted-foreground");
    ctx.font = "14px 'Inter', sans-serif";
    ctx.textAlign = "center";
    ctx.fillText("Belum ada data produktivitas.", width / 2, height / 2);
    return;
  }

  const accentColor = getColorToken("--accent");
  const axisColor = getColorToken("--muted-foreground");

  const margin = { top: 24, right: 24, bottom: 36, left: 44 };
  const chartWidth = width - margin.left - margin.right;
  const chartHeight = height - margin.top - margin.bottom;
  const maxValue = Math.max(...dataset.map((point) => point.value), 10);
  const step = chartWidth / dataset.length;
  const barWidth = step * 0.6;

  ctx.strokeStyle = axisColor;
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(margin.left, margin.top);
  ctx.lineTo(margin.left, margin.top + chartHeight);
  ctx.lineTo(width - margin.right, margin.top + chartHeight);
  ctx.stroke();

  ctx.font = "12px 'Inter', sans-serif";
  ctx.fillStyle = axisColor;
  ctx.textAlign = "center";

  dataset.forEach((point, index) => {
    const value = Math.max(point.value, 0);
    const scaledHeight = (value / maxValue) * chartHeight;
    const x = margin.left + index * step + (step - barWidth) / 2;
    const y = margin.top + chartHeight - scaledHeight;

    ctx.fillStyle = accentColor;
    ctx.beginPath();
    const radius = 8;
    const bottom = margin.top + chartHeight;
    ctx.moveTo(x, bottom);
    ctx.lineTo(x, y + radius);
    ctx.quadraticCurveTo(x, y, x + radius, y);
    ctx.lineTo(x + barWidth - radius, y);
    ctx.quadraticCurveTo(x + barWidth, y, x + barWidth, y + radius);
    ctx.lineTo(x + barWidth, bottom);
    ctx.closePath();
    ctx.fill();

    ctx.fillStyle = axisColor;
    ctx.fillText(point.label, x + barWidth / 2, height - margin.bottom / 2);
    ctx.fillText(`${value}`, x + barWidth / 2, y - 6);
  });
};

const renderSummary = () => {
  const { alerts, trend, summary, devices, metrics } = getState();
  const health = buildHealthSummary(devices);

  if (alertCountEl) {
    alertCountEl.textContent = `${alerts.length} Alert`;
  }
  if (healthValueEl) {
    healthValueEl.textContent = `${health.score}%`;
  }
  if (uptimeEl) {
    uptimeEl.textContent = `Uptime ${Math.round(summary.uptime ?? 97)}%`;
  }
  if (healthMessageEl) {
    healthMessageEl.textContent = health.message;
  }
  if (progressChipEl) {
    progressChipEl.textContent = `${metrics.progressRatio}% selesai`;
  }
  if (taskCountEl) {
    taskCountEl.textContent = `${metrics.completedTasks} dari ${metrics.totalTasks} tugas selesai.`;
  }

  renderAlerts(alerts);
  renderTaskSessions(metrics.sessions);
  renderTrendList(trend);
  renderProductivityChart(trend);
};

const handleAlertCreate = (event) => {
  event.preventDefault();
  const formData = new FormData(alertForm);
  const title = formData.get("title")?.toString().trim();
  const message = formData.get("message")?.toString().trim();
  const level = formData.get("level")?.toString() ?? "info";
  if (!title || !message) return;

  const timestamp = `${timeFormatter.format(new Date())} WIB`;

  updateAnalytics((analytics) => {
    const alerts = analytics.alerts ?? [];
    return {
      ...analytics,
      alerts: [
        {
          id: generateId("alert"),
          title,
          message,
          level,
          timestamp,
        },
        ...alerts,
      ],
    };
  });

  alertForm.reset();
  renderSummary();
};

const handleTrendCreate = (event) => {
  event.preventDefault();
  const formData = new FormData(trendForm);
  const label = formData.get("label")?.toString().trim();
  const rawValue = formData.get("value");
  const value = Number.parseFloat(rawValue);
  if (!label || Number.isNaN(value)) return;

  updateAnalytics((analytics) => {
    const trend = analytics.productivityTrend ?? [];
    return {
      ...analytics,
      productivityTrend: [
        ...trend,
        {
          id: generateId("trend"),
          label,
          value,
        },
      ],
    };
  });

  trendForm.reset();
  renderSummary();
};

const handleAlertAction = (event) => {
  const button = event.target.closest("button[data-action]");
  if (!button) return;
  const { action, id } = button.dataset;
  if (!id) return;

  if (action === "delete-alert") {
    updateAnalytics((analytics) => ({
      ...analytics,
      alerts: (analytics.alerts ?? []).filter((alert) => alert.id !== id),
    }));
    renderSummary();
    return;
  }

  if (action === "edit-alert") {
    const { analytics } = getState();
    const current = (analytics.alerts ?? []).find((alert) => alert.id === id);
    if (!current) return;

    const nextTitle = window.prompt("Perbarui judul alert:", current.title);
    if (nextTitle === null) return;
    const nextMessage = window.prompt("Perbarui pesan alert:", current.message);
    if (nextMessage === null) return;

    updateAnalytics((analyticsState) => ({
      ...analyticsState,
      alerts: (analyticsState.alerts ?? []).map((alert) =>
        alert.id === id
          ? { ...alert, title: nextTitle.trim(), message: nextMessage.trim() }
          : alert
      ),
    }));
    renderSummary();
  }
};

const handleTrendAction = (event) => {
  const button = event.target.closest("button[data-action]");
  if (!button) return;
  const { action, id } = button.dataset;
  if (!id) return;

  if (action === "delete-trend") {
    updateAnalytics((analytics) => ({
      ...analytics,
      productivityTrend: (analytics.productivityTrend ?? []).filter(
        (entry) => entry.id !== id
      ),
    }));
    renderSummary();
    return;
  }

  if (action === "edit-trend") {
    const { analytics } = getState();
    const current = (analytics.productivityTrend ?? []).find(
      (entry) => entry.id === id
    );
    if (!current) return;

    const nextLabel = window.prompt("Perbarui label minggu:", current.label);
    if (nextLabel === null) return;
    const nextValueString = window.prompt(
      "Perbarui nilai produktivitas (kg):",
      String(current.value)
    );
    if (nextValueString === null) return;
    const nextValue = Number.parseFloat(nextValueString);
    if (Number.isNaN(nextValue)) return;

    updateAnalytics((analyticsState) => ({
      ...analyticsState,
      productivityTrend: (analyticsState.productivityTrend ?? []).map((entry) =>
        entry.id === id
          ? { ...entry, label: nextLabel.trim(), value: nextValue }
          : entry
      ),
    }));
    renderSummary();
  }
};

if (alertForm) {
  alertForm.addEventListener("submit", handleAlertCreate);
}

if (trendForm) {
  trendForm.addEventListener("submit", handleTrendCreate);
}

if (alertListEl) {
  alertListEl.addEventListener("click", handleAlertAction);
}

if (trendListEl) {
  trendListEl.addEventListener("click", handleTrendAction);
}

renderSummary();
