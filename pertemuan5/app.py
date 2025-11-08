"""CLI sederhana untuk mengelola perpustakaan."""

from __future__ import annotations

from typing import Callable, Dict

from library import Library
from models import Book, Magazine, LibraryItem


def seed_data(library: Library) -> None:
    """Tambahkan data awal agar menu dapat langsung diuji."""
    library.add_item(Book("B001", "Clean Code", "Robert C. Martin", 2008, "Software", 464))
    library.add_item(Book("B002", "Laskar Pelangi", "Andrea Hirata", 2005, "Fiksi", 529))
    library.add_item(Magazine("M001", "National Geographic", "NatGeo", 2024, "10/2024"))
    library.add_item(Magazine("M002", "Majalah Bobo", "Kompas", 2023, "07/2023"))


def tampilkan_daftar(library: Library) -> None:
    items = library.list_items()
    if not items:
        print("Belum ada koleksi.")
        return
    print(f"{'ID':<6} {'Tipe':<10} {'Judul':<30} {'Kreator':<20} {'Tahun':<6} {'Status':<10}")
    print("-" * 90)
    for item in items:
        status = "Tersedia" if item.available else "Dipinjam"
        print(
            f"{item.item_id:<6} {item.item_type():<10} {item.title:<30} "
            f"{item.creator:<20} {item.year:<6} {status:<10}"
        )


def tambah_buku(library: Library) -> None:
    item_id = input("ID Buku       : ").strip()
    title = input("Judul         : ").strip()
    author = input("Penulis       : ").strip()
    year = int(input("Tahun terbit  : ").strip())
    genre = input("Genre         : ").strip()
    pages = int(input("Jumlah halaman: ").strip())
    library.add_item(Book(item_id, title, author, year, genre, pages))
    print("Buku berhasil ditambahkan.\n")


def tambah_majalah(library: Library) -> None:
    item_id = input("ID Majalah    : ").strip()
    title = input("Judul         : ").strip()
    publisher = input("Penerbit      : ").strip()
    year = int(input("Tahun terbit  : ").strip())
    issue = input("Nomor edisi   : ").strip()
    library.add_item(Magazine(item_id, title, publisher, year, issue))
    print("Majalah berhasil ditambahkan.\n")


def cari_item(library: Library) -> None:
    keyword = input("Masukkan judul atau ID: ").strip()
    hasil = library.search(keyword)
    if not hasil:
        print("Item tidak ditemukan.\n")
        return
    for item in hasil:
        print(f"- {item.item_type()} [{item.item_id}] {item.describe()}")
    print()


def detail_item(library: Library) -> None:
    item_id = input("Masukkan ID item: ").strip()
    item = library.find_by_id(item_id)
    if not item:
        print("Item tidak ditemukan.\n")
        return
    status = "Tersedia" if item.available else "Dipinjam"
    print(
        f"Detail Item:\n"
        f"ID     : {item.item_id}\n"
        f"Judul  : {item.title}\n"
        f"Creator: {item.creator}\n"
        f"Tahun  : {item.year}\n"
        f"Status : {status}\n"
        f"Deskripsi: {item.describe()}\n"
    )


def ubah_status(library: Library) -> None:
    item_id = input("Masukkan ID item: ").strip()
    item = library.find_by_id(item_id)
    if not item:
        print("Item tidak ditemukan.\n")
        return
    pilihan = input("Ubah status ke (1) Tersedia, (2) Dipinjam: ").strip()
    if pilihan == "1":
        item.available = True
        print("Status diperbarui menjadi tersedia.\n")
    elif pilihan == "2":
        item.available = False
        print("Status diperbarui menjadi dipinjam.\n")
    else:
        print("Pilihan tidak valid.\n")


def menu() -> str:
    print(
        """
=== Sistem Manajemen Perpustakaan ===
1. Tampilkan daftar item
2. Tambah buku baru
3. Tambah majalah baru
4. Cari item (judul/ID)
5. Detail item berdasarkan ID
6. Ubah status ketersediaan
7. Keluar
"""
    )
    return input("Pilih menu (1-7): ").strip()


def main() -> None:
    library = Library()
    seed_data(library)
    handlers: Dict[str, Callable[[Library], None]] = {
        "1": tampilkan_daftar,
        "2": tambah_buku,
        "3": tambah_majalah,
        "4": cari_item,
        "5": detail_item,
        "6": ubah_status,
    }

    while True:
        pilihan = menu()
        if pilihan == "7":
            print("Terima kasih telah menggunakan sistem perpustakaan!")
            break
        handler = handlers.get(pilihan)
        if handler:
            try:
                handler(library)
            except ValueError as err:
                print(f"Terjadi kesalahan: {err}\n")
        else:
            print("Pilihan tidak dikenal, silakan coba lagi.\n")


if __name__ == "__main__":
    main()

