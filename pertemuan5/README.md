# Sistem Manajemen Perpustakaan

Implementasi praktikum Python OOP pertemuan 5. Proyek ini memanfaatkan abstract class, inheritance, encapsulation, dan polymorphism untuk mengelola koleksi item perpustakaan.

## Fitur Utama
- `LibraryItem` sebagai abstract class dengan properti terenkapsulasi (`available`) dan metode abstrak (`item_type`, `describe`).
- Subclass konkrit `Book` dan `Magazine` yang meng-override metode abstrak sehingga menunjukkan polymorphism.
- `Library` sebagai pengelola koleksi menggunakan enkapsulasi daftar item dan menyediakan operasi tambah, cari, serta lihat detail.
- CLI (`app.py`) dengan menu interaktif untuk menambah item, menampilkan daftar, mencari, dan mengubah status ketersediaan.

## Struktur Berkas
```
pertemuan5/
|-- app.py              # Entry point CLI
|-- library.py          # Kelas Library dan logika koleksi
|-- models/
|   |-- __init__.py     # Ekspor class untuk kemudahan import
|   |-- base.py         # Abstract class LibraryItem
|   \-- items.py        # Subclass Book dan Magazine
\-- README.md
```

## Cara Menjalankan
1. Buka terminal pada folder `pertemuan5`.
2. Jalankan `python app.py`.
3. Ikuti menu yang tersedia untuk mencoba fitur tambah item, pencarian, dan update status.

## Screenshot (isi sendiri)
Tambahkan gambar hasil eksekusi CLI di bagian ini, misalnya dengan menempatkan file pada folder `pertemuan5/assets/` lalu merujuknya seperti:

```md
![Screenshot hasil program](assets/screenshot.png)
```

## Diagram Class (opsional)
Jika dibutuhkan, Anda dapat menambahkan diagram class sederhana untuk menggambarkan relasi antar class di atas.
