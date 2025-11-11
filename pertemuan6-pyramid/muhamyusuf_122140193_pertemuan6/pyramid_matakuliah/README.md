# Aplikasi Manajemen Matakuliah - Pyramid Framework

Aplikasi API sederhana untuk manajemen matakuliah menggunakan Pyramid Framework dan PostgreSQL.

## Deskripsi Proyek

Aplikasi ini adalah REST API untuk mengelola data matakuliah dengan operasi CRUD (Create, Read, Update, Delete) lengkap. Aplikasi ini dibangun menggunakan:
- **Pyramid Framework**: Web framework Python yang fleksibel
- **PostgreSQL**: Database relational untuk menyimpan data
- **SQLAlchemy**: ORM untuk interaksi dengan database
- **Alembic**: Tool untuk migrasi database

## Persyaratan Sistem

- Python 3.7 atau lebih tinggi
- PostgreSQL 12 atau lebih tinggi
- uv (Python package manager)

## Struktur Database

### Tabel Matakuliah

| Field | Tipe | Constraint | Deskripsi |
|-------|------|------------|-----------|
| id | Integer | Primary Key, Auto Increment | ID unik matakuliah |
| kode_mk | Text | Unique, Not Null | Kode mata kuliah |
| nama_mk | Text | Not Null | Nama mata kuliah |
| sks | Integer | Not Null | Jumlah SKS |
| semester | Integer | Not Null | Semester pengambilan |

## Cara Instalasi

### 1. Clone/Download Project

```bash
cd pyramid_matakuliah
```

### 2. Setup Virtual Environment dengan uv

```bash
# Install uv jika belum ada
pip install uv

# Buat virtual environment
uv venv

# Aktifkan virtual environment
# Windows PowerShell
.venv\Scripts\activate

# Linux/macOS
source .venv/bin/activate
```

### 3. Install Dependencies

```bash
# Install cookiecutter
uv pip install cookiecutter

# Install dependencies proyek
uv pip install -e ".[testing]"

# Install psycopg2-binary untuk PostgreSQL
uv pip install psycopg2-binary
```

### 4. Konfigurasi Database

Pastikan PostgreSQL sudah berjalan dan update file `development.ini`:

```ini
sqlalchemy.url = postgresql://postgres:mysecret@localhost:5432/postgres
```

Sesuaikan username, password, host, port, dan nama database dengan konfigurasi PostgreSQL Anda.

### 5. Menjalankan Migrasi Database

```bash
# Generate file migrasi
alembic -c development.ini revision --autogenerate -m "create matakuliah table"

# Jalankan migrasi
alembic -c development.ini upgrade head

# Inisialisasi data awal
initialize_pyramid_matakuliah_db development.ini
```

## Cara Menjalankan

### Menjalankan Server Development

```bash
# Pastikan virtual environment sudah aktif
pserve development.ini --reload
```

Server akan berjalan di `http://localhost:6543`

## API Endpoints

### 1. Get All Matakuliah

**Endpoint:** `GET /api/matakuliah`

**Deskripsi:** Mendapatkan daftar semua matakuliah

**Request:**
```bash
# PowerShell
(Invoke-WebRequest -Uri "http://localhost:6543/api/matakuliah" -Method GET).Content

# curl (Linux/macOS)
curl -X GET http://localhost:6543/api/matakuliah
```

**Response:**
```json
{
  "matakuliahs": [
    {
      "id": 1,
      "kode_mk": "IF101",
      "nama_mk": "Algoritma dan Pemrograman",
      "sks": 3,
      "semester": 1
    },
    {
      "id": 2,
      "kode_mk": "IF102",
      "nama_mk": "Struktur Data",
      "sks": 4,
      "semester": 2
    },
    {
      "id": 3,
      "kode_mk": "IF201",
      "nama_mk": "Basis Data",
      "sks": 3,
      "semester": 3
    }
  ]
}
```

### 2. Get Matakuliah Detail

**Endpoint:** `GET /api/matakuliah/{id}`

**Deskripsi:** Mendapatkan detail satu matakuliah berdasarkan ID

**Request:**
```bash
# PowerShell
(Invoke-WebRequest -Uri "http://localhost:6543/api/matakuliah/1" -Method GET).Content

# curl (Linux/macOS)
curl -X GET http://localhost:6543/api/matakuliah/1
```

**Response:**
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

### 3. Add New Matakuliah

**Endpoint:** `POST /api/matakuliah`

**Deskripsi:** Menambahkan matakuliah baru

**Request Body:**
```json
{
  "kode_mk": "IF301",
  "nama_mk": "Pemrograman Web",
  "sks": 3,
  "semester": 5
}
```

**Request:**
```bash
# PowerShell
$body = @{
    kode_mk='IF301'
    nama_mk='Pemrograman Web'
    sks=3
    semester=5
} | ConvertTo-Json

(Invoke-WebRequest -Uri "http://localhost:6543/api/matakuliah" -Method POST -Body $body -ContentType "application/json").Content

# curl (Linux/macOS)
curl -X POST http://localhost:6543/api/matakuliah \
-H "Content-Type: application/json" \
-d '{
  "kode_mk": "IF301",
  "nama_mk": "Pemrograman Web",
  "sks": 3,
  "semester": 5
}'
```

**Response:**
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

### 4. Update Matakuliah

**Endpoint:** `PUT /api/matakuliah/{id}`

**Deskripsi:** Mengupdate data matakuliah (semua field opsional)

**Request Body:**
```json
{
  "sks": 4,
  "semester": 6
}
```

**Request:**
```bash
# PowerShell
$body = @{
    sks=4
    semester=6
} | ConvertTo-Json

(Invoke-WebRequest -Uri "http://localhost:6543/api/matakuliah/4" -Method PUT -Body $body -ContentType "application/json").Content

# curl (Linux/macOS)
curl -X PUT http://localhost:6543/api/matakuliah/4 \
-H "Content-Type: application/json" \
-d '{
  "sks": 4,
  "semester": 6
}'
```

**Response:**
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

### 5. Delete Matakuliah

**Endpoint:** `DELETE /api/matakuliah/{id}`

**Deskripsi:** Menghapus data matakuliah berdasarkan ID

**Request:**
```bash
# PowerShell
(Invoke-WebRequest -Uri "http://localhost:6543/api/matakuliah/4" -Method DELETE).Content

# curl (Linux/macOS)
curl -X DELETE http://localhost:6543/api/matakuliah/4
```

**Response:**
```json
{
  "success": true,
  "message": "Matakuliah dengan id 4 berhasil dihapus"
}
```

## Testing

### Testing dengan PowerShell (Windows)

Gunakan `Invoke-WebRequest` seperti contoh di atas.

### Testing dengan curl (Linux/macOS/Windows)

Gunakan perintah curl seperti contoh di atas.

### Testing dengan Postman

1. Download dan install Postman dari https://www.postman.com/downloads/
2. Buat request baru dengan method yang sesuai (GET, POST, PUT, DELETE)
3. Masukkan URL endpoint
4. Untuk POST/PUT, pilih tab "Body" → "raw" → "JSON" dan masukkan data JSON
5. Klik "Send"

### Testing dengan VS Code REST Client

1. Install extension "REST Client" di VS Code
2. Buat file `test-api.http`
3. Tulis request dan klik "Send Request"

```http
### Get all matakuliah
GET http://localhost:6543/api/matakuliah

### Get detail matakuliah
GET http://localhost:6543/api/matakuliah/1

### Add new matakuliah
POST http://localhost:6543/api/matakuliah
Content-Type: application/json

{
  "kode_mk": "IF301",
  "nama_mk": "Pemrograman Web",
  "sks": 3,
  "semester": 5
}

### Update matakuliah
PUT http://localhost:6543/api/matakuliah/1
Content-Type: application/json

{
  "sks": 4,
  "semester": 6
}

### Delete matakuliah
DELETE http://localhost:6543/api/matakuliah/4
```

## Error Handling

API ini mengembalikan error response dalam format JSON:

**404 Not Found:**
```json
{
  "error": "Matakuliah tidak ditemukan"
}
```

**400 Bad Request:**
```json
{
  "error": "Field kode_mk wajib diisi"
}
```

atau

```json
{
  "error": "SKS dan semester harus berupa angka"
}
```

## Troubleshooting

### Error: "Import could not be resolved"
Ini adalah peringatan dari Pylance yang bisa diabaikan. Dependencies sudah terinstall dengan benar di virtual environment.

### Error: "Connection refused"
- Pastikan server Pyramid sedang berjalan
- Periksa port yang digunakan (default: 6543)
- Gunakan `http://127.0.0.1:6543` jika `localhost` tidak berfungsi

### Error: Database connection failed
- Pastikan PostgreSQL sedang berjalan
- Periksa konfigurasi `sqlalchemy.url` di `development.ini`
- Verifikasi username, password, dan nama database sudah benar

### Error: "alembic command not found"
Pastikan virtual environment sudah aktif sebelum menjalankan perintah alembic.

## Struktur Proyek

```
pyramid_matakuliah/
├── development.ini           # Konfigurasi development
├── production.ini            # Konfigurasi production
├── setup.py                  # Package setup
├── pyramid_matakuliah/
│   ├── __init__.py          # App initialization
│   ├── routes.py            # Route configuration
│   ├── models/              # Database models
│   │   ├── __init__.py
│   │   ├── meta.py
│   │   ├── mymodel.py
│   │   └── matakuliah.py    # Matakuliah model
│   ├── views/               # View functions
│   │   ├── __init__.py
│   │   ├── default.py
│   │   ├── notfound.py
│   │   └── matakuliah.py    # Matakuliah views
│   ├── scripts/             # Utility scripts
│   │   └── initialize_db.py
│   ├── alembic/             # Database migrations
│   ├── static/              # Static files
│   └── templates/           # Jinja2 templates
└── README.md                # This file
```

## Teknologi yang Digunakan

- **Python 3.10**: Bahasa pemrograman
- **Pyramid 2.0**: Web framework
- **SQLAlchemy 2.0**: ORM
- **Alembic 1.17**: Database migration tool
- **PostgreSQL**: Database
- **psycopg2-binary 2.9**: PostgreSQL adapter
- **uv**: Fast Python package installer

## Author

**Muhammad Yusuf**
- NIM: 122140193
- Praktikum: Pemrograman Web Pertemuan 6

## Lisensi

Project ini dibuat untuk keperluan praktikum Pemrograman Web.
