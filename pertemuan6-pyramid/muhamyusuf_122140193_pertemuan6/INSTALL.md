# 📦 Panduan Instalasi - Pyramid Mata Kuliah

## Prasyarat

- Python 3.8 atau lebih baru
- pip (Python package installer)
- Virtual environment (recommended)

## Langkah Instalasi

### 1. Clone Repository (jika belum)

```bash
git clone https://github.com/muhamyusuf/pemrograman_web_itera_122140193.git
cd pemrograman_web_itera_122140193/pertemuan6-pyramid/muhamyusuf_122140193_pertemuan6
```

### 2. Buat Virtual Environment

**Windows (PowerShell):**
```powershell
python -m venv .venv
.\.venv\Scripts\Activate.ps1
```

**Windows (CMD):**
```cmd
python -m venv .venv
.venv\Scripts\activate.bat
```

**Linux/Mac:**
```bash
python3 -m venv .venv
source .venv/bin/activate
```

### 3. Install Dependencies

**Instalasi Production (Minimal):**
```bash
pip install -r requirements.txt
```

**Instalasi Development (Lengkap dengan dev tools):**
```bash
pip install -r requirements-dev.txt
```

**Atau install dari setup.py:**
```bash
cd pyramid_matakuliah
pip install -e .
```

### 4. Setup Database

```bash
cd pyramid_matakuliah
alembic -c development.ini revision --autogenerate -m "init"
alembic -c development.ini upgrade head
```

### 5. Initialize Database (jika ada script)

```bash
initialize_pyramid_matakuliah_db development.ini
```

### 6. Jalankan Server

**Development Server:**
```bash
pserve development.ini --reload
```

**Production Server:**
```bash
pserve production.ini
```

Server akan berjalan di: `http://localhost:6543`

## Verifikasi Instalasi

Test apakah server berjalan dengan baik:

```bash
curl http://localhost:6543
```

Atau buka browser dan akses:
- Homepage: `http://localhost:6543`
- API: `http://localhost:6543/api/matakuliah`

## Troubleshooting

### Error: "No module named 'pyramid'"

Pastikan virtual environment sudah diaktifkan:
```bash
.\.venv\Scripts\Activate.ps1  # Windows
source .venv/bin/activate      # Linux/Mac
```

### Error: "SQLAlchemy database not found"

Jalankan database initialization:
```bash
alembic -c development.ini upgrade head
```

### Port 6543 sudah digunakan

Edit file `development.ini` atau `production.ini`:
```ini
[server:main]
port = 8080  # Ganti ke port lain
```

## Update Dependencies

Untuk update semua package ke versi terbaru:

```bash
pip install --upgrade -r requirements.txt
```

## Freeze Dependencies

Untuk membuat snapshot exact versions:

```bash
pip freeze > requirements-lock.txt
```

## Uninstall

```bash
pip uninstall -r requirements.txt -y
deactivate
```

## 🆘 Bantuan

Jika mengalami masalah:
1. Pastikan Python versi 3.8+: `python --version`
2. Update pip: `python -m pip install --upgrade pip`
3. Clear cache: `pip cache purge`
4. Reinstall: `pip install -r requirements.txt --force-reinstall`

---

**Author**: Muhammad Yusuf (122140193)  
**Updated**: November 2025
