@echo off
REM ============================================
REM Quick Setup Script - Pyramid Mata Kuliah
REM ============================================

echo.
echo ========================================
echo   Pyramid Mata Kuliah - Quick Setup
echo ========================================
echo.

REM Check if Python is installed
python --version >nul 2>&1
if errorlevel 1 (
    echo [ERROR] Python tidak ditemukan!
    echo Silakan install Python 3.8+ terlebih dahulu.
    pause
    exit /b 1
)

echo [1/5] Membuat virtual environment...
if not exist ".venv" (
    python -m venv .venv
    echo ✓ Virtual environment berhasil dibuat
) else (
    echo ✓ Virtual environment sudah ada
)

echo.
echo [2/5] Aktivasi virtual environment...
call .venv\Scripts\activate.bat

echo.
echo [3/5] Update pip...
python -m pip install --upgrade pip

echo.
echo [4/5] Install dependencies...
pip install -r requirements.txt

echo.
echo [5/5] Setup selesai!
echo.
echo ========================================
echo   Cara menjalankan aplikasi:
echo ========================================
echo 1. Aktivasi virtual environment:
echo    .venv\Scripts\activate
echo.
echo 2. Jalankan server:
echo    cd pyramid_matakuliah
echo    pserve development.ini --reload
echo.
echo 3. Akses di browser:
echo    http://localhost:6543
echo ========================================
echo.

pause
