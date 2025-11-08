"""Abstraksi dasar untuk setiap item perpustakaan."""

from __future__ import annotations

from abc import ABC, abstractmethod


class LibraryItem(ABC):
    """Blueprint item perpustakaan dengan enkapsulasi ID, judul, dan status."""

    def __init__(self, item_id: str, title: str, creator: str, year: int) -> None:
        self._item_id = item_id  # protected agar masih bisa diakses turunan
        self._title = title
        self._creator = creator
        self._year = year
        self.__available = True  # private, hanya bisa diakses lewat property

    @property
    def item_id(self) -> str:
        return self._item_id

    @property
    def title(self) -> str:
        return self._title

    @property
    def creator(self) -> str:
        return self._creator

    @property
    def year(self) -> int:
        return self._year

    @property
    def available(self) -> bool:
        return self.__available

    @available.setter
    def available(self, value: bool) -> None:
        if not isinstance(value, bool):
            raise ValueError("Status ketersediaan harus bernilai boolean.")
        self.__available = value

    def matches(self, keyword: str) -> bool:
        """Periksa apakah keyword cocok dengan ID atau judul."""
        keyword_lower = keyword.lower()
        return keyword_lower in self._title.lower() or keyword_lower == self._item_id.lower()

    @abstractmethod
    def item_type(self) -> str:
        """Nama tipe item, diimplementasikan oleh subclass."""

    @abstractmethod
    def describe(self) -> str:
        """Penjelasan ringkas item untuk ditampilkan di tabel."""

    def __repr__(self) -> str:  # debug helper
        return f"<{self.item_type()} {self._item_id} - {self._title}>"

