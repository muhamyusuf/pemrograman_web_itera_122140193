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
3. Ikuti menu yang tersedia untuk mencoba fitur tambah item, pencarian, update status, dan keluar dari aplikasi.

## Menu Program
- `1. Tampilkan daftar item` &mdash; Menampilkan seluruh koleksi saat ini lengkap dengan tipe, kreator, tahun, dan status ketersediaan.
- `2. Tambah buku baru` &mdash; Menginput detil buku (ID, judul, penulis, tahun, genre, halaman) lalu menambahkannya ke koleksi.
- `3. Tambah majalah baru` &mdash; Mirip menu 2 namun untuk majalah dengan data penerbit dan nomor edisi.
- `4. Cari item (judul/ID)` &mdash; Melakukan pencarian bebas berbasis substring judul atau kecocokan ID.
- `5. Detail item berdasarkan ID` &mdash; Menampilkan informasi lengkap satu item termasuk deskripsi `describe()`.
- `6. Ubah status ketersediaan` &mdash; Mengganti flag `available` menjadi tersedia/dipinjam untuk mempraktekkan encapsulation melalui property.
- `7. Keluar` &mdash; Menutup aplikasi secara bersih.

## Screenshot Program
![Menu utama](assets/ss-pt5-1.png)
![Daftar koleksi](assets/ss-pt5-2.png)
![Tambah buku](assets/ss-pt5-3.png)
![Tambah majalah](assets/ss-pt5-4.png)
![Pencarian item](assets/ss-pt5-5.png)
![Detail item](assets/ss-pt5-6.png)
![Ubah status dan keluar](assets/ss-pt5-7.png)

## Diagram Class
Gunakan diagram Mermaid berikut untuk menggambarkan relasi antar class:

```mermaid
classDiagram
    class LibraryItem {
        <<abstract>>
        -_item_id: str
        -_title: str
        -_creator: str
        -_year: int
        -__available: bool
        +item_id: str
        +title: str
        +creator: str
        +year: int
        +available: bool
        +matches(keyword): bool
        +item_type()*: str
        +describe()*: str
    }

    class Book {
        -_genre: str
        -_pages: int
        +item_type(): str
        +describe(): str
    }

    class Magazine {
        -_issue: str
        +item_type(): str
        +describe(): str
    }

    class Library {
        -__items: List~LibraryItem~
        +add_item(item)
        +list_items()
        +find_by_id(item_id)
        +search(keyword)
    }

    LibraryItem <|-- Book
    LibraryItem <|-- Magazine
    Library "1" o-- "*" LibraryItem : mengelola
```
