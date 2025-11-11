# QUICK START GUIDE

## Untuk Menjalankan Proyek

### 1. Masuk ke direktori proyek
```bash
cd pyramid_matakuliah
```

### 2. Aktifkan virtual environment
```bash
# Windows PowerShell
..\.venv\Scripts\activate

# Linux/macOS
source ../.venv/bin/activate
```

### 3. Pastikan database sudah dimigrasi (skip jika sudah)
```bash
alembic -c development.ini upgrade head
initialize_pyramid_matakuliah_db development.ini
```

### 4. Jalankan server
```bash
pserve development.ini --reload
```

Server akan berjalan di: http://localhost:6543

## Test API Cepat

### Browser
Buka: http://localhost:6543/api/matakuliah

### PowerShell
```powershell
(Invoke-WebRequest -Uri "http://localhost:6543/api/matakuliah" -Method GET).Content
```

### VS Code REST Client
Buka file `test-api.http` dan klik "Send Request"

## Struktur Endpoint

- `GET /api/matakuliah` - List semua
- `GET /api/matakuliah/{id}` - Detail satu
- `POST /api/matakuliah` - Tambah baru
- `PUT /api/matakuliah/{id}` - Update
- `DELETE /api/matakuliah/{id}` - Hapus

## Dokumentasi Lengkap

Lihat file `README.md` untuk dokumentasi lengkap dengan contoh request/response.

## Files Penting

- `README.md` - Dokumentasi lengkap
- `test-api.http` - File testing dengan VS Code REST Client
- `SUMMARY.md` - Ringkasan pengerjaan tugas
- `development.ini` - Konfigurasi database dan aplikasi
- `pyramid_matakuliah/models/matakuliah.py` - Model database
- `pyramid_matakuliah/views/matakuliah.py` - CRUD views
- `pyramid_matakuliah/routes.py` - Route configuration
