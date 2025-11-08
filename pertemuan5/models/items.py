"""Implementasi konkrit item perpustakaan."""

from __future__ import annotations

from dataclasses import dataclass

from .base import LibraryItem


class Book(LibraryItem):
    """Representasi buku dengan genre dan jumlah halaman."""

    def __init__(
        self,
        item_id: str,
        title: str,
        author: str,
        year: int,
        genre: str,
        pages: int,
    ) -> None:
        super().__init__(item_id, title, author, year)
        self._genre = genre
        self._pages = pages

    def item_type(self) -> str:
        return "Book"

    def describe(self) -> str:
        return f"{self.title} oleh {self.creator} ({self.year}) - {self._genre}, {self._pages} hlm"


class Magazine(LibraryItem):
    """Representasi majalah dengan nomor edisi."""

    def __init__(
        self,
        item_id: str,
        title: str,
        publisher: str,
        year: int,
        issue: str,
    ) -> None:
        super().__init__(item_id, title, publisher, year)
        self._issue = issue

    def item_type(self) -> str:
        return "Magazine"

    def describe(self) -> str:
        return f"{self.title} #{self._issue} ({self.year}) - {self.creator}"


__all__ = ["Book", "Magazine"]

