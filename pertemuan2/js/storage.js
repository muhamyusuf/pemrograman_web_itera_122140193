const clone = (value) =>
  typeof structuredClone === "function"
    ? structuredClone(value)
    : JSON.parse(JSON.stringify(value));

class StorageService {
  constructor(key, defaultValue = {}) {
    this.key = key;
    this.defaultValue = defaultValue;
  }

  load() {
    const saved = localStorage.getItem(this.key);
    if (!saved) return clone(this.defaultValue);
    try {
      return JSON.parse(saved);
    } catch (error) {
      console.warn(
        "Gagal mengurai data localStorage, reset ke default.",
        error
      );
      this.save(this.defaultValue);
      return clone(this.defaultValue);
    }
  }

  save(value) {
    localStorage.setItem(this.key, JSON.stringify(value));
  }

  update(updater) {
    const snapshot = this.load();
    const nextState = updater(clone(snapshot));
    this.save(nextState);
    return nextState;
  }
}

const now = new Date();
const timeFormatter = new Intl.DateTimeFormat("id-ID", {
  hour: "2-digit",
  minute: "2-digit",
});

const stateShape = {
  tasks: [
    {
      id: "task-siram",
      title: "Siram rak A",
      description: "Pastikan air nutrisi mencapai garis batas sensor.",
      schedule: "07:30",
      completed: false,
    },
    {
      id: "task-cek-ph",
      title: "Cek pH nutrisi",
      description:
        "Target berada di kisaran 5.8 - 6.2 sebelum jam makan siang.",
      schedule: "11:00",
      completed: true,
    },
    {
      id: "task-pest",
      title: "Inspeksi hama",
      description: "Amati daun bawah untuk cek jamur atau kutu daun.",
      schedule: "16:30",
      completed: false,
    },
  ],
  notes: [
    {
      id: "note-monitor",
      text: "Sensor ACE butuh kalibrasi ringan, siapkan buffer solution.",
      createdAt: "Senin, 21 Oktober 2024 - 09.15",
    },
    {
      id: "note-harvest",
      text: "Panen parsial rak B berhasil, simpan catatan berat di sheet.",
      createdAt: "Rabu, 23 Oktober 2024 - 14.05",
    },
  ],
  devices: [
    {
      id: "SM201",
      name: "JLNew H10: Soil Moisture Sensor",
      type: "Sensor",
      status: "online",
      lastPing: "09:32",
      signal: 2.5,
    },
    {
      id: "WS004",
      name: "HC T200 Wind Sensor",
      type: "Sensor",
      status: "online",
      lastPing: "09:30",
      signal: 3.1,
    },
    {
      id: "TH011",
      name: "ACE Temp & Humidity Sensor",
      type: "Sensor",
      status: "warning",
      lastPing: "08:02",
      signal: -1.5,
    },
    {
      id: "CM042",
      name: "VG550 Camera",
      type: "Camera",
      status: "online",
      lastPing: "09:37",
      signal: 2.8,
    },
    {
      id: "PM225",
      name: "Sanity pH Meter",
      type: "Sensor",
      status: "online",
      lastPing: "09:35",
      signal: 1.8,
    },
  ],
  analytics: {
    summary: {
      health: 94,
      uptime: 97,
      progressRatio: 0,
      completedTasks: 0,
      totalTasks: 0,
    },
    alerts: [
      {
        id: "alert-ace",
        title: "ACE Temperature & Humidity Sensor",
        message: "Perlu kalibrasi ringan, sinyal turun sejak 08.02.",
        level: "warning",
        timestamp: `${timeFormatter.format(now)} WIB`,
      },
      {
        id: "alert-nutrient",
        title: "Reservoir Nutrisi",
        message: "Volume tinggal 22%, jadwalkan isi ulang siang ini.",
        level: "info",
        timestamp: `${timeFormatter.format(now)} WIB`,
      },
    ],
    productivityTrend: [
      { label: "Sen", value: 48 },
      { label: "Sel", value: 52 },
      { label: "Rab", value: 55 },
      { label: "Kam", value: 51 },
      { label: "Jum", value: 57 },
      { label: "Sab", value: 60 },
      { label: "Min", value: 54 },
    ],
    tasksBySession: [
      { label: "Pagi", value: 0 },
      { label: "Siang", value: 0 },
      { label: "Malam", value: 0 },
    ],
  },
  integrations: [
    {
      id: "api",
      name: "Greenhouse API",
      status: "online",
      meta: "Terhubung - refresh 15 menit",
      action: "manage",
    },
    {
      id: "sheet",
      name: "Spreadsheet Manual",
      status: "offline",
      meta: "Belum sinkron",
      action: "sync",
      lastSync: null,
    },
  ],
  profile: {
    name: "Ayu Gardenia",
    email: "ayu.gardenia@example.com",
    phone: "+62 812 3456 7890",
    bio: "Koordinator greenhouse dengan fokus nutrisi hidroponik dan monitoring sensor real-time.",
    notes: [
      {
        id: "profile-note-1",
        text: "Fokuskan update nutrisi setiap Selasa dan Jumat.",
        timestamp: "10 Okt 2024",
      },
      {
        id: "profile-note-2",
        text: "Kalibrasi sensor kelembapan minimal dua minggu sekali.",
        timestamp: "21 Okt 2024",
      },
    ],
  },
  settings: {
    theme: "light",
    language: "id",
    autoRefresh: true,
  },
};

const storage = new StorageService("greenhouse-dashboard", stateShape);

export { StorageService, storage };
