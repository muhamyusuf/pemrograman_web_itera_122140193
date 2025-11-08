"""Kelas Library untuk mengelola koleksi item."""

from __future__ import annotations

from typing import List, Optional

from models.base import LibraryItem


class Library:
    """Mengelola list item dengan enkapsulasi koleksi."""

    def __init__(self) -> None:
        self.__items: List[LibraryItem] = []

    def add_item(self, item: LibraryItem) -> None:
        """Tambahkan item baru jika ID belum ada."""
        if any(existing.item_id.lower() == item.item_id.lower() for existing in self.__items):
            raise ValueError(f"Item dengan ID {item.item_id} sudah ada.")
        self.__items.append(item)

    def list_items(self) -> List[LibraryItem]:
        """Return salinan daftar item untuk mencegah modifikasi langsung."""
        return list(self.__items)

    def find_by_id(self, item_id: str) -> Optional[LibraryItem]:
        for item in self.__items:
            if item.item_id.lower() == item_id.lower():
                return item
        return None

    def search(self, keyword: str) -> List[LibraryItem]:
        return [item for item in self.__items if item.matches(keyword)]

