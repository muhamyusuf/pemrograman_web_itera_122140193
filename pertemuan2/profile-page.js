import { storage } from "./js/storage.js";

const profileContainer = document.querySelector("[data-profile-heading]");
const bioEl = document.querySelector("[data-profile-bio]");
const nameEl = document.querySelector("[data-profile-name]");
const emailEl = document.querySelector("[data-profile-email]");
const phoneEl = document.querySelector("[data-profile-phone]");
const notesContainer = document.querySelector("[data-profile-notes]");

const { profile = {} } = storage.load();

if (profileContainer && profile.name) {
  profileContainer.textContent = `Profil ${profile.name}`;
}

if (bioEl) {
  bioEl.textContent =
    profile.bio ??
    "Profil operator tidak tersedia. Masuk ke dashboard utama untuk memperbarui data.";
}

if (nameEl) {
  nameEl.textContent = profile.name ?? "-";
}

if (emailEl) {
  emailEl.textContent = profile.email ?? "-";
}

if (phoneEl) {
  phoneEl.textContent = profile.phone ?? "-";
}

if (notesContainer) {
  const notes = profile.notes ?? [];
  notesContainer.innerHTML = "";
  if (!notes.length) {
    const empty = document.createElement("div");
    empty.className = "note-item";
    empty.innerHTML =
      '<p>Belum ada catatan preferensi.</p><span class="note-item__time muted">Tambahkan catatan dari dashboard utama.</span>';
    notesContainer.append(empty);
  } else {
    notes.forEach((note) => {
      const item = document.createElement("div");
      item.className = "note-item";
      const text = document.createElement("p");
      text.textContent = note.text;
      const meta = document.createElement("span");
      meta.className = "note-item__time muted";
      meta.textContent = note.timestamp ?? "";
      item.append(text, meta);
      notesContainer.append(item);
    });
  }
}
