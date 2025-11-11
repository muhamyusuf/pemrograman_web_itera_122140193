# 🚀 Quick Reference - Pyramid Mata Kuliah

## ⚡ Quick Start (Windows)

```powershell
# Double click atau jalankan:
setup.bat

# Atau manual:
python -m venv .venv
.\.venv\Scripts\Activate.ps1
pip install -r requirements.txt
cd pyramid_matakuliah
pserve development.ini --reload
```

## ⚡ Quick Start (Linux/Mac)

```bash
# Jalankan:
bash setup.sh

# Atau manual:
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
cd pyramid_matakuliah
pserve development.ini --reload
```

## 📦 Installation Commands

| Command | Description |
|---------|-------------|
| `pip install -r requirements.txt` | Install dependencies |
| `pip install -r requirements-dev.txt` | Install dev dependencies |
| `pip install -e .` | Install editable mode |
| `pip freeze > requirements-lock.txt` | Lock versions |

## 🗄️ Database Commands

| Command | Description |
|---------|-------------|
| `alembic revision --autogenerate -m "msg"` | Create migration |
| `alembic upgrade head` | Run migrations |
| `alembic downgrade -1` | Rollback one step |
| `alembic current` | Show current version |
| `alembic history` | Show migration history |

## 🖥️ Server Commands

| Command | Description |
|---------|-------------|
| `pserve development.ini` | Start dev server |
| `pserve development.ini --reload` | Start with auto-reload |
| `pserve production.ini` | Start production server |

## 🧪 Testing Commands

| Command | Description |
|---------|-------------|
| `pytest` | Run all tests |
| `pytest tests/test_views.py` | Run specific test |
| `pytest --cov` | Run with coverage |
| `pytest -v` | Verbose output |

## 🔍 Useful Commands

| Command | Description |
|---------|-------------|
| `pip list` | List installed packages |
| `pip show pyramid` | Show package info |
| `python --version` | Check Python version |
| `which python` | Show Python path |

## 🌐 Default URLs

| URL | Description |
|-----|-------------|
| `http://localhost:6543` | Homepage |
| `http://localhost:6543/api/matakuliah` | API Endpoint |
| `http://localhost:6543/_debug_toolbar` | Debug Toolbar |

## 📁 Project Structure

```
pertemuan6/
├── requirements.txt          # Dependencies
├── requirements-dev.txt      # Dev dependencies
├── setup.bat                 # Windows setup
├── setup.sh                  # Linux/Mac setup
├── INSTALL.md               # Installation guide
└── pyramid_matakuliah/      # Main project
    ├── development.ini      # Dev config
    ├── production.ini       # Prod config
    ├── setup.py            # Package setup
    └── pyramid_matakuliah/ # Source code
```

## 🔧 Troubleshooting

### Virtual environment tidak aktif
```bash
# Windows
.\.venv\Scripts\Activate.ps1

# Linux/Mac
source .venv/bin/activate
```

### Port sudah digunakan
Edit `development.ini`:
```ini
[server:main]
port = 8080  # Ganti port
```

### Database error
```bash
cd pyramid_matakuliah
alembic upgrade head
```

### Module not found
```bash
pip install -r requirements.txt --force-reinstall
```

## 💡 Tips

- Selalu aktifkan virtual environment sebelum coding
- Gunakan `--reload` untuk development
- Commit `requirements.txt` ke git
- Jangan commit `.venv/` folder
- Backup database sebelum migration

## 🆘 Help

```bash
pserve --help
alembic --help
pytest --help
```

---

**Quick Help**: Jika stuck, jalankan:
```bash
pip install --upgrade pip
pip install -r requirements.txt --force-reinstall
```
