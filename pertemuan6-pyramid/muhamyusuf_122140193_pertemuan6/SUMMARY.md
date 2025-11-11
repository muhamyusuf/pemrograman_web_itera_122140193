# SUMMARY - Praktikum Pyramid Framework Pertemuan 6

## Informasi Mahasiswa
- **Nama:** Muhammad Yusuf
- **NIM:** 122140193
- **Tugas:** Aplikasi Manajemen Matakuliah dengan Pyramid Framework

## Yang Telah Dikerjakan

### 1. Setup Project dengan uv
- Membuat virtual environment menggunakan `uv venv`
- Install cookiecutter untuk template Pyramid
- Membuat project Pyramid dengan template `pyramid-cookiecutter-alchemy`
- Install semua dependencies dengan `uv pip install`
- Install psycopg2-binary untuk koneksi PostgreSQL

### 2. Konfigurasi Database
- Update `development.ini` untuk menggunakan PostgreSQL
- Connection string: `postgresql://postgres:mysecret@localhost:5432/postgres`
- Database sudah dikonfigurasi dan siap digunakan

### 3. Membuat Model Matakuliah
**File:** `pyramid_matakuliah/models/matakuliah.py`

Model dengan struktur:
- `id`: Integer, Primary Key, Auto Increment
- `kode_mk`: Text, Unique, Not Null
- `nama_mk`: Text, Not Null
- `sks`: Integer, Not Null
- `semester`: Integer, Not Null
- Method `to_dict()` untuk konversi ke JSON

### 4. Update Models & Initialize DB
**File Modified:**
- `pyramid_matakuliah/models/__init__.py` - Import model Matakuliah
- `pyramid_matakuliah/scripts/initialize_db.py` - Tambah 3 data awal:
  - IF101: Algoritma dan Pemrograman (3 SKS, Semester 1)
  - IF102: Struktur Data (4 SKS, Semester 2)
  - IF201: Basis Data (3 SKS, Semester 3)

### 5. Database Migration dengan Alembic
- Generate migration file dengan autogenerate
- Jalankan migrasi untuk membuat tabel `matakuliah`
- Inisialisasi database dengan data awal
- Tabel berhasil dibuat di PostgreSQL

### 6. Membuat Views CRUD
**File:** `pyramid_matakuliah/views/matakuliah.py`

Implementasi 5 view functions:
1. **matakuliah_list** - GET semua matakuliah
2. **matakuliah_detail** - GET detail satu matakuliah
3. **matakuliah_add** - POST matakuliah baru dengan validasi
4. **matakuliah_update** - PUT update matakuliah
5. **matakuliah_delete** - DELETE hapus matakuliah

Setiap view sudah dilengkapi dengan:
- Error handling
- Validasi input
- Response dalam format JSON
- HTTP status code yang sesuai (404, 400, 200)

### 7. Konfigurasi Routes
**File:** `pyramid_matakuliah/routes.py`

Menambahkan 5 routes dengan `request_method` yang tepat:
- `GET /api/matakuliah` → matakuliah_list
- `GET /api/matakuliah/{id}` → matakuliah_detail
- `POST /api/matakuliah` → matakuliah_add
- `PUT /api/matakuliah/{id}` → matakuliah_update
- `DELETE /api/matakuliah/{id}` → matakuliah_delete

**PENTING:** Parameter `request_method` sudah ditambahkan untuk memastikan routing berfungsi dengan benar!

### 8. Testing API
Semua endpoint sudah ditest dan berfungsi dengan baik:

#### Test GET All Matakuliah ✓
```json
{
  "matakuliahs": [
    {"id": 1, "kode_mk": "IF101", "nama_mk": "Algoritma dan Pemrograman", "sks": 3, "semester": 1},
    {"id": 2, "kode_mk": "IF102", "nama_mk": "Struktur Data", "sks": 4, "semester": 2},
    {"id": 3, "kode_mk": "IF201", "nama_mk": "Basis Data", "sks": 3, "semester": 3}
  ]
}
```

#### Test GET Detail ✓
```json
{
  "matakuliah": {
    "id": 1,
    "kode_mk": "IF101",
    "nama_mk": "Algoritma dan Pemrograman",
    "sks": 3,
    "semester": 1
  }
}
```

#### Test POST (Tambah Baru) ✓
```json
{
  "success": true,
  "matakuliah": {
    "id": 4,
    "kode_mk": "IF301",
    "nama_mk": "Pemrograman Web",
    "sks": 3,
    "semester": 5
  }
}
```

#### Test PUT (Update) ✓
```json
{
  "success": true,
  "matakuliah": {
    "id": 4,
    "kode_mk": "IF301",
    "nama_mk": "Pemrograman Web",
    "sks": 4,
    "semester": 6
  }
}
```

#### Test DELETE ✓
```json
{
  "success": true,
  "message": "Matakuliah dengan id 4 berhasil dihapus"
}
```

### 9. Dokumentasi Lengkap
**File:** `README.md`

Dokumentasi mencakup:
- Deskripsi proyek
- Struktur database
- Cara instalasi step-by-step dengan uv
- Cara menjalankan aplikasi
- Dokumentasi lengkap semua API endpoints
- Contoh request dan response untuk setiap endpoint
- Cara testing dengan PowerShell, curl, Postman, dan VS Code REST Client
- Error handling
- Troubleshooting
- Struktur proyek
- Teknologi yang digunakan

**File Tambahan:** `test-api.http`
- File untuk testing dengan VS Code REST Client extension
- Berisi semua endpoint dengan contoh request
- Termasuk test case untuk validasi error

## Struktur File Proyek

```
muhamyusuf_122140193_pertemuan6/
└── pyramid_matakuliah/
    ├── development.ini              # ✓ Updated (PostgreSQL config)
    ├── README.md                    # ✓ Created (Dokumentasi lengkap)
    ├── test-api.http                # ✓ Created (Test file)
    └── pyramid_matakuliah/
        ├── models/
        │   ├── __init__.py          # ✓ Updated (Import Matakuliah)
        │   └── matakuliah.py        # ✓ Created (Model Matakuliah)
        ├── views/
        │   └── matakuliah.py        # ✓ Created (CRUD Views)
        ├── scripts/
        │   └── initialize_db.py     # ✓ Updated (Data awal)
        ├── routes.py                # ✓ Updated (API routes)
        └── alembic/
            └── versions/
                └── 20251110_*.py    # ✓ Generated (Migration file)
```

## Cara Menjalankan

1. **Pastikan PostgreSQL berjalan**
   ```bash
   # Sesuaikan connection string di development.ini jika perlu
   ```

2. **Masuk ke folder project**
   ```bash
   cd muhamyusuf_122140193_pertemuan6/pyramid_matakuliah
   ```

3. **Aktifkan virtual environment**
   ```bash
   ..\.venv\Scripts\activate  # Windows
   ```

4. **Jalankan server**
   ```bash
   pserve development.ini --reload
   ```

5. **Test API** (pilih salah satu):
   - Buka browser: `http://localhost:6543/api/matakuliah`
   - PowerShell: Lihat contoh di README.md
   - VS Code: Buka `test-api.http` dan klik "Send Request"
   - Postman: Import endpoint dari dokumentasi

## Teknologi yang Digunakan

- ✅ **Python 3.10**
- ✅ **Pyramid Framework 2.0**
- ✅ **SQLAlchemy 2.0** (ORM)
- ✅ **Alembic 1.17** (Database Migration)
- ✅ **PostgreSQL** (Database)
- ✅ **psycopg2-binary 2.9** (PostgreSQL Driver)
- ✅ **uv** (Package Manager) - Sesuai permintaan!

## Catatan Penting

1. **Virtual Environment menggunakan uv** ✓
   - Lebih cepat dari pip biasa

2. **Parameter request_method** ✓
   - Sudah ditambahkan di semua route
   - Mencegah konflik endpoint dengan URL sama

3. **Error Handling** ✓
   - 404 untuk resource tidak ditemukan
   - 400 untuk validasi error
   - Response JSON yang konsisten

4. **Validasi Input** ✓
   - Field required divalidasi
   - Tipe data divalidasi (SKS dan semester harus integer)

5. **Data Awal** ✓
   - 3 matakuliah sudah ditambahkan saat initialize_db
   - Bisa ditambah lagi melalui API

## Status Pengerjaan

- [x] Setup environment dengan uv
- [x] Model Matakuliah
- [x] Database migration
- [x] CRUD Views (5 endpoints)
- [x] Routes configuration
- [x] Testing semua endpoint
- [x] Dokumentasi lengkap
- [x] File test-api.http

## Testing Evidence

Semua endpoint sudah ditest dengan hasil sukses:
- GET /api/matakuliah → 200 OK (menampilkan 3 data awal)
- GET /api/matakuliah/1 → 200 OK (detail IF101)
- POST /api/matakuliah → 200 OK (data baru berhasil ditambahkan)
- PUT /api/matakuliah/4 → 200 OK (data berhasil diupdate)
- DELETE /api/matakuliah/4 → 200 OK (data berhasil dihapus)

---

**Dikerjakan oleh:**
Muhammad Yusuf - 122140193

**Tanggal:** 10 November 2025

**Untuk:** Praktikum Pemrograman Web Pertemuan 6
