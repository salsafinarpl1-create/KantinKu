"use client";
import { useState, useEffect } from "react";
import { menuData, rupiah } from "@/data/menu";
import Link from "next/link";

export default function FavoritPage() {
  const [menuFavorit, setMenuFavorit] = useState<any[]>([]);

  const loadFavorit = () => {
    const dataFav = localStorage.getItem("favorit");
    if (dataFav) {
      const favoritIds: number[] = JSON.parse(dataFav);
      const filterMenu = menuData.filter((item: any) =>
        favoritIds.includes(item.id),
      );
      setMenuFavorit(filterMenu);
    } else {
      setMenuFavorit([]);
    }
  };

  useEffect(() => {
    loadFavorit();
    window.addEventListener("storage", loadFavorit);
    return () => window.removeEventListener("storage", loadFavorit);
  }, []);

  const hapusFavorit = (id: number) => {
    const dataFav = localStorage.getItem("favorit");
    if (dataFav) {
      const favoritIds: number[] = JSON.parse(dataFav);
      const updatedFavorit = favoritIds.filter((favId) => favId !== id);
      localStorage.setItem("favorit", JSON.stringify(updatedFavorit));
      loadFavorit();
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8 bg-slate-50/50 min-h-screen">
      {/* Header Section */}
      <div className="border-b border-slate-200/80 pb-6">
        <span className="text-xs uppercase tracking-wider bg-red-100 text-red-600 px-3 py-1 rounded-full font-bold">
          Koleksi Pilihan ❤️
        </span>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 mt-2">
          Menu Favorit Saya
        </h1>
        <p className="text-slate-500 text-sm sm:text-base mt-1">
          Daftar makanan dan minuman yang sudah kamu tandai untuk dipesan
          kembali.
        </p>
      </div>

      {/* Grid Menu Favorit */}
      {menuFavorit.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-3xl border border-slate-200/80 shadow-sm space-y-4 max-w-lg mx-auto">
          <div className="text-6xl">💔</div>
          <h3 className="font-bold text-xl text-slate-800">
            Belum Ada Favorit
          </h3>
          <p className="text-slate-500 text-sm px-6">
            Kamu belum menandai makanan atau minuman apa pun. Yuk jelajahi menu
            dan klik tombol ikon hati!
          </p>
          <Link
            href="/menu"
            className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-bold px-6 py-3 rounded-2xl text-sm transition-all shadow-md shadow-blue-500/20"
          >
            Jelajahi Menu Sekarang →
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {menuFavorit.map((menu: any) => (
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

                  {/* Tombol Hapus Favorit */}
                  <button
                    onClick={() => hapusFavorit(menu.id)}
                    className="p-2.5 bg-red-50 border border-red-200 text-red-500 rounded-2xl hover:bg-red-100 hover:scale-105 transition-all shadow-sm"
                    title="Hapus dari Favorit"
                  >
                    ❤️
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
          ))}
        </div>
      )}
    </div>
  );
}
