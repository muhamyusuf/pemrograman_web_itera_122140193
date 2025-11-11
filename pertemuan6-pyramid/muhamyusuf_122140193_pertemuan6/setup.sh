#!/bin/bash
# ============================================
# Quick Setup Script - Pyramid Mata Kuliah
# ============================================

echo ""
echo "========================================"
echo "  Pyramid Mata Kuliah - Quick Setup"
echo "========================================"
echo ""

# Check if Python is installed
if ! command -v python3 &> /dev/null; then
    echo "[ERROR] Python3 tidak ditemukan!"
    echo "Silakan install Python 3.8+ terlebih dahulu."
    exit 1
fi

echo "[1/5] Membuat virtual environment..."
if [ ! -d ".venv" ]; then
    python3 -m venv .venv
    echo "✓ Virtual environment berhasil dibuat"
else
    echo "✓ Virtual environment sudah ada"
fi

echo ""
echo "[2/5] Aktivasi virtual environment..."
source .venv/bin/activate

echo ""
echo "[3/5] Update pip..."
python -m pip install --upgrade pip

echo ""
echo "[4/5] Install dependencies..."
pip install -r requirements.txt

echo ""
echo "[5/5] Setup selesai!"
echo ""
echo "========================================"
echo "  Cara menjalankan aplikasi:"
echo "========================================"
echo "1. Aktivasi virtual environment:"
echo "   source .venv/bin/activate"
echo ""
echo "2. Jalankan server:"
echo "   cd pyramid_matakuliah"
echo "   pserve development.ini --reload"
echo ""
echo "3. Akses di browser:"
echo "   http://localhost:6543"
echo "========================================"
echo ""
