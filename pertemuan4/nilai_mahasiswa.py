"""Program pengelolaan data nilai mahasiswa sesuai brief pertemuan 4.

Fitur:
- Data awal minimal 5 mahasiswa disimpan dalam list of dict
- Fungsi terpisah untuk menghitung nilai akhir, menentukan grade, menampilkan tabel,
  mencari mahasiswa dengan nilai tertinggi/terendah
- Menu interaktif untuk menambah data, memfilter berdasarkan grade, dan menghitung
  rata-rata nilai kelas
"""

from __future__ import annotations

from typing import Dict, List

Mahasiswa = Dict[str, float | str]


def hitung_nilai_akhir(mahasiswa: Mahasiswa) -> float:
    """Hitung nilai akhir dengan bobot 30% UTS, 40% UAS, 30% tugas."""
    nilai = (
        mahasiswa["nilai_uts"] * 0.30
        + mahasiswa["nilai_uas"] * 0.40
        + mahasiswa["nilai_tugas"] * 0.30
    )
    return round(nilai, 2)


def tentukan_grade(nilai_akhir: float) -> str:
    """Kembalikan huruf grade berdasarkan rentang nilai."""
    if nilai_akhir >= 80:
        return "A"
    if nilai_akhir >= 70:
        return "B"
    if nilai_akhir >= 60:
        return "C"
    if nilai_akhir >= 50:
        return "D"
    return "E"


def tampilkan_tabel(mahasiswas: List[Mahasiswa]) -> None:
    """Cetak data mahasiswa lengkap dalam format tabel."""
    if not mahasiswas:
        print("Belum ada data.")
        return

    header = ["No", "Nama", "NIM", "UTS", "UAS", "Tugas", "Nilai Akhir", "Grade"]
    rows = []
    for idx, mhs in enumerate(mahasiswas, start=1):
        nilai_akhir = hitung_nilai_akhir(mhs)
        grade = tentukan_grade(nilai_akhir)
        rows.append(
            [
                str(idx),
                mhs["nama"],
                mhs["nim"],
                f"{mhs['nilai_uts']:.1f}",
                f"{mhs['nilai_uas']:.1f}",
                f"{mhs['nilai_tugas']:.1f}",
                f"{nilai_akhir:.2f}",
                grade,
            ]
        )

    col_widths = [
        max(len(header[col]), *(len(row[col]) for row in rows)) for col in range(len(header))
    ]

    def cetak_bar(data: List[str]) -> None:
        print(" | ".join(s.ljust(col_widths[i]) for i, s in enumerate(data)))

    garis = "-+-".join("-" * w for w in col_widths)
    cetak_bar(header)
    print(garis)
    for row in rows:
        cetak_bar(row)


def cari_mahasiswa(mahasiswas: List[Mahasiswa], mode: str) -> Mahasiswa | None:
    """Kembalikan mahasiswa dengan nilai akhir tertinggi atau terendah."""
    if not mahasiswas:
        return None
    key_func = hitung_nilai_akhir
    if mode == "tertinggi":
        return max(mahasiswas, key=key_func)
    if mode == "terendah":
        return min(mahasiswas, key=key_func)
    raise ValueError("Mode harus 'tertinggi' atau 'terendah'.")


def input_nilai(prompt: str) -> float:
    """Minta input nilai float dengan validasi rentang 0-100."""
    while True:
        try:
            nilai = float(input(prompt))
            if 0 <= nilai <= 100:
                return nilai
            print("Nilai harus 0-100.")
        except ValueError:
            print("Masukkan angka yang valid.")


def tambah_mahasiswa(mahasiswas: List[Mahasiswa]) -> None:
    """Tambah data mahasiswa baru melalui input pengguna."""
    print("\nInput data mahasiswa baru")
    nama = input("Nama          : ").strip()
    nim = input("NIM           : ").strip()
    nilai_uts = input_nilai("Nilai UTS (0-100)   : ")
    nilai_uas = input_nilai("Nilai UAS (0-100)   : ")
    nilai_tugas = input_nilai("Nilai Tugas (0-100) : ")

    mahasiswas.append(
        {
            "nama": nama or "Tanpa Nama",
            "nim": nim or "0000000000",
            "nilai_uts": nilai_uts,
            "nilai_uas": nilai_uas,
            "nilai_tugas": nilai_tugas,
        }
    )
    print("Data berhasil ditambahkan!\n")


def filter_grade(mahasiswas: List[Mahasiswa], target_grade: str) -> List[Mahasiswa]:
    """Kembalikan list mahasiswa yang sesuai dengan grade tertentu."""
    target_grade = target_grade.upper()
    return [
        mhs
        for mhs in mahasiswas
        if tentukan_grade(hitung_nilai_akhir(mhs)) == target_grade
    ]


def hitung_rata_rata(mahasiswas: List[Mahasiswa]) -> float:
    """Hitung rata-rata nilai akhir kelas."""
    if not mahasiswas:
        return 0.0
    total = sum(hitung_nilai_akhir(mhs) for mhs in mahasiswas)
    return round(total / len(mahasiswas), 2)


def cetak_extreme(mahasiswas: List[Mahasiswa], mode: str) -> None:
    """Cetak mahasiswa nilai tertinggi atau terendah beserta detailnya."""
    mahasiswa = cari_mahasiswa(mahasiswas, mode)
    if mahasiswa is None:
        print("Belum ada data.")
        return
    nilai_akhir = hitung_nilai_akhir(mahasiswa)
    grade = tentukan_grade(nilai_akhir)
    print(f"Mahasiswa dengan nilai {mode}:")
    print(f"- Nama : {mahasiswa['nama']}")
    print(f"- NIM  : {mahasiswa['nim']}")
    print(f"- Nilai akhir : {nilai_akhir:.2f} ({grade})\n")


def menu() -> str:
    """Tampilkan menu dan ambil pilihan pengguna."""
    print(
        """
===== Menu Pengelolaan Nilai =====
1. Tampilkan tabel nilai
2. Tambah mahasiswa baru
3. Tampilkan nilai tertinggi & terendah
4. Filter mahasiswa berdasarkan grade
5. Hitung rata-rata nilai kelas
6. Keluar
"""
    )
    return input("Pilih menu (1-6): ").strip()


def main() -> None:
    data_mahasiswa: List[Mahasiswa] = [
        {"nama": "Alya Rahma", "nim": "119140001", "nilai_uts": 78, "nilai_uas": 82, "nilai_tugas": 80},
        {"nama": "Bima Saputra", "nim": "119140002", "nilai_uts": 65, "nilai_uas": 70, "nilai_tugas": 68},
        {"nama": "Citra Lestari", "nim": "119140003", "nilai_uts": 88, "nilai_uas": 90, "nilai_tugas": 92},
        {"nama": "Doni Pratama", "nim": "119140004", "nilai_uts": 55, "nilai_uas": 60, "nilai_tugas": 58},
        {"nama": "Eka Wulandari", "nim": "119140005", "nilai_uts": 72, "nilai_uas": 75, "nilai_tugas": 70},
    ]

    while True:
        pilihan = menu()
        if pilihan == "1":
            tampilkan_tabel(data_mahasiswa)
            print()
        elif pilihan == "2":
            tambah_mahasiswa(data_mahasiswa)
        elif pilihan == "3":
            cetak_extreme(data_mahasiswa, "tertinggi")
            cetak_extreme(data_mahasiswa, "terendah")
        elif pilihan == "4":
            target = input("Masukkan grade yang ingin difilter (A-E): ").strip().upper()
            hasil = filter_grade(data_mahasiswa, target)
            if hasil:
                print(f"\nMahasiswa dengan grade {target}:")
                tampilkan_tabel(hasil)
            else:
                print(f"Tidak ada mahasiswa dengan grade {target}.")
            print()
        elif pilihan == "5":
            rata_rata = hitung_rata_rata(data_mahasiswa)
            if data_mahasiswa:
                print(f"Rata-rata nilai akhir kelas: {rata_rata:.2f}\n")
            else:
                print("Belum ada data untuk dihitung.\n")
        elif pilihan == "6":
            print("Terima kasih! Program selesai.")
            break
        else:
            print("Pilihan tidak valid. Coba lagi.\n")


if __name__ == "__main__":
    main()

