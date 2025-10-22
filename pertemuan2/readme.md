## Greenhouse Companion Dashboard

Dashboard pribadi untuk memantau kebun hidroponik kecil ala greenhouse monitoring. Tata letaknya pakai kartu lembut, warna pastel, dan elemen interaktif yang responsif seperti contoh referensi.

### Cara Jalanin

- Buka file `pertemuan2/index.html` langsung di browser modern (Chrome, Edge, atau Firefox).
- Semua logika ada di folder `pertemuan2/js`, jadi tidak butuh server tambahan.
- Kalau mau mulai dari nol lagi, hapus storage dengan membuka DevTools > Application > Local Storage > `greenhouse-dashboard`, lalu clear.

### Fitur Utama

- **Ringkasan cuaca**: tombol refresh memicu request asinkron palsu (`fetchWeatherSnapshot`) yang meng-update suhu, kondisi, kelembapan, angin, dan UV.
- **Task board**: tambah, edit, centang, dan hapus tugas. Progress bar otomatis menyesuaikan dan state tersimpan di localStorage.
- **Catatan cepat**: simpan ide lapangan, dan hapus jika sudah tidak relevan.
- **Daftar perangkat**: render dinamis dari data sensor yang dipisah per modul. Sekaligus memengaruhi kalkulasi skor kesehatan tanaman.
- **UI responsif**: grid fleksibel untuk tablet, laptop, sampai layar ponsel.
- **Sidebar bertaut**: setiap ikon mengarah ke halaman `analytics.html`, `tasks.html`, `settings.html`, dan `profile.html` supaya navigasi terasa natural.
- **Analitik lintas halaman**: seluruh data (tugas, catatan, perangkat, integrasi, profil) tersimpan di localStorage sehingga tetap konsisten ketika halaman diganti.
- **Chart produktivitas**: `analytics.html` menampilkan bar chart tren panen mingguan yang digambar manual dengan canvas vanilla JS.

### Implementasi ES6+ yang Dipakai

- `let` dan `const` untuk deklarasi variabel yang jelas scope-nya.
- Module ES6 (`import` / `export`) membagi logika ke `storage.js`, `card.js`, `chart.js`, `table.js`, `task-utils.js`, `sidebar.js`, `button.js`, dan skrip halaman (`index.js`, `analytics.js`, `tasks-page.js`, `settings-page.js`, `profile-page.js`).
- Minimal tiga arrow function, contohnya `formatDate`, `formatTime`, handler event, dan utilities lain.
- Template literals untuk render teks dinamis seperti `${ratio}% selesai` dan informasi kartu.
- Destructuring + rest/spread (misal `({ tasks, ...rest }) => ({ ...rest, tasks: [...] })`) saat mengelola state.
- Class `Dashboard` sebagai pengelola utama UI dan state.
- `async` / `await` di `fetchWeatherSnapshot` dan `refreshWeather` buat simulasi pemanggilan API.
- Default parameter di `openTaskDialog(task = {...})` dan `fetchWeatherSnapshot(location = ...)`.
- Canvas API dipakai di `analytics.js` untuk menggambar chart tanpa library eksternal.

### Struktur Folder Singkat

```
pertemuan2/
|-- analytics.html        # ringkasan statistik statis
|-- analytics.js          # renderer analitik & chart
|-- assets/
|   `-- image.png         # ilustrasi untuk kartu kamera
|-- index.html            # dashboard utama (task, catatan, cuaca)
|-- index.js              # inisialisasi dashboard utama
|-- nav.js                # inisialisasi highlight sidebar lintas halaman
|-- profile.html          # info operator singkat
|-- profile-page.js       # loader data profil
|-- settings.html         # mockup pengaturan workspace
|-- settings-page.js      # pengelola preferensi & integrasi
|-- style.css             # styling dengan variabel shadcn-style
|-- tasks.html            # shortcut alur tugas harian
|-- tasks-page.js         # renderer task lintas halaman
`-- js/
    |-- button.js
    |-- card.js
    |-- chart.js
    |-- sidebar.js
    |-- storage.js
    |-- table.js
    `-- task-utils.js
```

### Styling

- Variabel CSS mengikuti pola shadcn (`--background`, `--accent`, `--border`, dsb) supaya gampang diutak-utik.
- Kartu punya radius lembut plus shadow halus untuk meniru desain referensi.
- Breakpoint tablet dan mobile menjaga layout tetap rapi dalam mode responsif.

### Catatan Tambahan

- Data awal (tugas dan catatan) otomatis muncul dari default localStorage supaya dashboard tidak kosong saat pertama dibuka.
- Semua interaksi tombol utama punya fallback loading state supaya UX tetap terasa halus.
- Halaman tambahan bersifat informatif; aksi CRUD penuh tetap dipusatkan di `index.html` supaya kode JavaScript modular tetap sederhana.
- Helper `task-utils.js` menyatukan logika sesi tugas sehingga dashboard dan halaman analitik menggunakan perhitungan yang sama.
- Sinkronisasi manual via halaman pengaturan memperbarui status integrasi yang sama terbaca di halaman lain tanpa perlu refresh tambahan.
