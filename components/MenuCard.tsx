"use client";

import { useState, useEffect } from "react";
import { rupiah } from "@/data/menu";
import Link from "next/link";

export default function MenuCard({ item }: { item: any }) {
  const [isFavorit, setIsFavorit] = useState(false);

  // Periksa apakah menu ini sudah ada di daftar favorit saat komponen dimuat
  useEffect(() => {
    const favorit = JSON.parse(
      localStorage.getItem("favorit_kantinku") || "[]",
    );
    const status = favorit.some((fav: any) => fav.id === item.id);
    setIsFavorit(status);
  }, [item.id]);

  // Fungsi Toggle Favorit (Tambah / Hapus)
  const toggleFavorit = (e: React.MouseEvent) => {
    e.preventDefault(); // Mencegah pindah halaman saat tombol diklik
    const favorit = JSON.parse(
      localStorage.getItem("favorit_kantinku") || "[]",
    );

    if (isFavorit) {
      // Hapus dari favorit
      const updated = favorit.filter((fav: any) => fav.id !== item.id);
      localStorage.setItem("favorit_kantinku", JSON.stringify(updated));
      setIsFavorit(false);
    } else {
      // Tambah ke favorit
      favorit.push(item);
      localStorage.setItem("favorit_kantinku", JSON.stringify(favorit));
      setIsFavorit(true);
    }
  };

  return (
    <Link
      href={`/menu/${item.id}`}
      className="block bg-white rounded-lg shadow-md p-4 border hover:shadow-lg transition-shadow"
    >
      <div className="flex justify-between items-start mb-2">
        <h3 className="font-bold text-slate-800 text-lg">{item.nama}</h3>

        {/* Tombol Favorit ❤️ */}
        <button
          onClick={toggleFavorit}
          className={`p-2 rounded-full transition-colors ${
            isFavorit
              ? "text-red-500 bg-red-50"
              : "text-slate-400 hover:bg-slate-100"
          }`}
          title={isFavorit ? "Hapus dari Favorit" : "Simpan ke Favorit"}
        >
          {isFavorit ? "❤️" : "🤍"}
        </button>
      </div>

      <p className="text-sm text-slate-500 mb-2">{item.kategori}</p>
      <div className="flex justify-between items-center mt-4">
        <span className="font-bold text-blue-600">{rupiah(item.harga)}</span>
        <span
          className={`text-xs px-2 py-1 rounded font-medium ${item.stok > 0 ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}
        >
          {item.stok > 0 ? `Stok: ${item.stok}` : "Habis"}
        </span>
      </div>
    </Link>
  );
}
