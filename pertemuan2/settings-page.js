import { storage } from "./js/storage.js";

const form = document.querySelector("[data-settings-form]");
const themeSelect = document.querySelector("[data-settings-theme]");
const languageSelect = document.querySelector("[data-settings-language]");
const refreshCheckbox = document.querySelector("[data-settings-refresh]");
const feedbackEl = document.querySelector("[data-settings-feedback]");
const integrationListEl = document.querySelector("[data-integration-list]");
const integrationFeedbackEl = document.querySelector(
  "[data-integration-feedback]"
);

const ICONS = {
  manage:
    '<svg viewBox="0 0 24 24" focusable="false"><path d="M3 17.25V21h3.75l11-11-3.75-3.75-11 11Zm2.92.83 8.58-8.58 1.17 1.17-8.59 8.58H5.92Zm12.71-12.7a1 1 0 0 1 0 1.41l-1.17 1.17-3.75-3.75 1.17-1.17a1 1 0 0 1 1.41 0l2.34 2.34Z"/></svg>',
  sync: '<svg viewBox="0 0 24 24" focusable="false"><path d="M6 6a6 6 0 0 1 10.39-4.24l-1.42 1.42A4 4 0 0 0 8 6h2l-3 3-3-3h2Zm12 12a6 6 0 0 1-10.39 4.24l1.42-1.42A4 4 0 0 0 16 18h-2l3-3 3 3h-2Z"/></svg>',
};

const timeFormatter = new Intl.DateTimeFormat("id-ID", {
  hour: "2-digit",
  minute: "2-digit",
});

const loadSettings = () => {
  const snapshot = storage.load();
  return {
    settings: snapshot.settings ?? {},
    integrations: snapshot.integrations ?? [],
  };
};

const setFeedback = (element, message) => {
  if (!element) return;
  element.textContent = message;
  if (message) {
    setTimeout(() => {
      if (element.textContent === message) {
        element.textContent = "";
      }
    }, 2500);
  }
};

const renderIntegrations = () => {
  if (!integrationListEl) return;
  const { integrations } = loadSettings();
  integrationListEl.innerHTML = "";

  if (!integrations.length) {
    const empty = document.createElement("li");
    empty.className = "note-item";
    empty.innerHTML =
      '<p>Tidak ada integrasi terdaftar.</p><span class="note-item__time muted">Tambah integrasi baru dari dashboard admin.</span>';
    integrationListEl.append(empty);
    return;
  }

  integrations.forEach((integration) => {
    const item = document.createElement("li");
    item.className = "device-item";

    const status = document.createElement("span");
    status.className = "device-item__status";
    if (integration.status === "online") {
      status.classList.add("is-online");
    } else if (integration.status === "warning") {
      status.classList.add("is-warning");
    }

    const body = document.createElement("div");
    body.className = "device-item__body";

    const name = document.createElement("strong");
    name.className = "device-item__name";
    name.textContent = integration.name;

    const meta = document.createElement("div");
    meta.className = "device-item__meta muted";
    meta.textContent = integration.meta ?? "";

    body.append(name, meta);

    const button = document.createElement("button");
    button.className = "icon-button";
    button.type = "button";
    button.innerHTML = ICONS[integration.action] ?? ICONS.manage;
    button.setAttribute(
      "aria-label",
      integration.action === "sync" ? "Sinkronkan data" : "Kelola integrasi"
    );
    button.addEventListener("click", () =>
      handleIntegrationAction(integration.id)
    );

    item.append(status, body, button);
    integrationListEl.append(item);
  });
};

const handleIntegrationAction = (id) => {
  const { integrations } = loadSettings();
  const current = integrations.find((entry) => entry.id === id);
  if (!current) return;

  if (current.action === "sync") {
    const timestamp = timeFormatter.format(new Date());
    storage.update((snapshot) => ({
      ...snapshot,
      integrations: snapshot.integrations.map((integration) =>
        integration.id === id
          ? {
              ...integration,
              status: "online",
              meta: `Sinkron terakhir ${timestamp}`,
              lastSync: new Date().toISOString(),
            }
          : integration
      ),
    }));
    renderIntegrations();
    setFeedback(integrationFeedbackEl, "Sinkronisasi manual berhasil.");
  } else {
    setFeedback(
      integrationFeedbackEl,
      "Permintaan pembaruan dikirim. Cek email untuk instruksi selanjutnya."
    );
  }
};

const hydrateForm = () => {
  const { settings } = loadSettings();
  if (themeSelect) {
    themeSelect.value = settings.theme ?? "light";
  }
  if (languageSelect) {
    languageSelect.value = settings.language ?? "id";
  }
  if (refreshCheckbox) {
    refreshCheckbox.checked = Boolean(settings.autoRefresh);
  }
};

if (form) {
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const theme = themeSelect ? themeSelect.value : "light";
    const language = languageSelect ? languageSelect.value : "id";
    const autoRefresh = refreshCheckbox ? refreshCheckbox.checked : true;

    storage.update((snapshot) => ({
      ...snapshot,
      settings: {
        ...(snapshot.settings ?? {}),
        theme,
        language,
        autoRefresh,
      },
    }));

    setFeedback(feedbackEl, "Preferensi tersimpan.");
  });
}

hydrateForm();
renderIntegrations();
