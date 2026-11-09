"use client";
import { useState, useEffect } from "react";
import { menuData, rupiah } from "@/data/menu";
import Link from "next/link";

export default function MenuPage() {
  const [cari, setCari] = useState("");
  const [kategoriAktif, setKategoriAktif] = useState("Semua");
  const [favoritList, setFavoritList] = useState<number[]>([]);

  useEffect(() => {
    const dataFav = localStorage.getItem("favorit");
    if (dataFav) {
      setFavoritList(JSON.parse(dataFav));
    }
  }, []);

  const toggleFavorit = (id: number, e: React.MouseEvent) => {
    e.preventDefault();
    let updatedFavorit;
    if (favoritList.includes(id)) {
      updatedFavorit = favoritList.filter((favId) => favId !== id);
    } else {
      updatedFavorit = [...favoritList, id];
    }
    setFavoritList(updatedFavorit);
    localStorage.setItem("favorit", JSON.stringify(updatedFavorit));
  };

  const kategoriList = ["Semua", "Makanan", "Minuman", "Cemilan"];

  const menuFiltered = menuData.filter((item: any) => {
    const sesuaiPencarian = item.nama
      .toLowerCase()
      .includes(cari.toLowerCase());
    const sesuaiKategori =
      kategoriAktif === "Semua" ||
      item.kategori.toLowerCase() === kategoriAktif.toLowerCase();
    return sesuaiPencarian && sesuaiKategori;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8 bg-slate-50/50 min-h-screen">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-slate-200/80 pb-6">
        <div>
          <span className="text-xs uppercase tracking-wider bg-blue-100 text-blue-700 px-3 py-1 rounded-full font-bold">
            Katalog Kuliner 🍜
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 mt-2">
            Daftar Menu KantinKu
          </h1>
          <p className="text-slate-500 text-sm sm:text-base mt-1">
            Pilih makanan atau minuman favoritmu dengan mudah dan cepat.
          </p>
        </div>

        {/* Search Bar */}
        <div className="w-full md:w-80">
          <div className="relative">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400">
              🔍
            </span>
            <input
              type="text"
              placeholder="Cari makanan atau minuman..."
              value={cari}
              onChange={(e) => setCari(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-white border border-slate-200 rounded-2xl text-sm font-medium text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent shadow-sm transition-all"
            />
          </div>
        </div>
      </div>

      {/* Filter Kategori Chips */}
      <div className="flex flex-wrap items-center gap-2.5">
        {kategoriList.map((kat) => (
          <button
            key={kat}
            onClick={() => setKategoriAktif(kat)}
            className={`px-5 py-2.5 rounded-2xl text-sm font-semibold transition-all shadow-sm ${
              kategoriAktif === kat
                ? "bg-blue-600 text-white shadow-blue-500/25 shadow-md scale-105"
                : "bg-white text-slate-600 border border-slate-200/80 hover:bg-slate-100 hover:border-slate-300"
            }`}
          >
            {kat}
          </button>
        ))}
      </div>

      {/* Grid Kartu Menu */}
      {menuFiltered.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-3xl border border-slate-200 shadow-sm space-y-3">
          <div className="text-5xl">🍽️</div>
          <h3 className="font-bold text-lg text-slate-700">
            Menu tidak ditemukan
          </h3>
          <p className="text-slate-400 text-sm">
            Coba cari dengan kata kunci atau kategori yang lain.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {menuFiltered.map((menu: any) => {
            const isFav = favoritList.includes(menu.id);

            return (
              <div
                key={menu.id}
                className="group bg-white border border-slate-200/80 rounded-3xl p-6 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  <div className="flex justify-between items-start gap-2">
                    <div>
                      <span className="text-[11px] uppercase tracking-wider bg-slate-100 text-slate-600 px-3 py-1 rounded-lg font-bold">
                        {menu.kategori}
                      </span>
                      <h3 className="font-bold text-xl text-slate-900 mt-3 group-hover:text-blue-600 transition-colors">
                        {menu.nama}
                      </h3>
                    </div>

                    {/* Tombol Favorit Melayang */}
                    <button
                      onClick={(e) => toggleFavorit(menu.id, e)}
                      className={`p-2.5 rounded-2xl border transition-all ${
                        isFav
                          ? "bg-red-50 border-red-200 text-red-500 scale-105 shadow-sm"
                          : "bg-slate-50 border-slate-200 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
                      }`}
                      title={isFav ? "Hapus dari Favorit" : "Tambah ke Favorit"}
                    >
                      {isFav ? "❤️" : "🤍"}
                    </button>
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-100">
                  <div className="flex justify-between items-center mb-4">
                    <div>
                      <span className="text-xs text-slate-400 block font-medium">
                        Harga
                      </span>
                      <span className="font-extrabold text-lg text-blue-600">
                        {rupiah(menu.harga)}
                      </span>
                    </div>
                    <span
                      className={`text-xs px-3 py-1.5 rounded-xl font-bold tracking-wide ${
                        menu.stok === 0
                          ? "bg-red-50 text-red-600 border border-red-100"
                          : "bg-emerald-50 text-emerald-600 border border-emerald-100"
                      }`}
                    >
                      {menu.stok === 0 ? "Habis" : `Stok: ${menu.stok}`}
                    </span>
                  </div>

                  <Link
                    href={`/menu/${menu.id}`}
                    className="block w-full py-3 text-center bg-blue-600 hover:bg-blue-700 active:scale-95 text-white font-bold rounded-2xl transition-all shadow-md shadow-blue-500/20 text-sm"
                  >
                    Lihat Detail & Beli →
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
