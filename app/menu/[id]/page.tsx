"use client";
import { menuData, rupiah } from "@/data/menu";
import { notFound, useRouter } from "next/navigation";
import Link from "next/link";
import { useState, useEffect, use, Suspense } from "react";

function DetailContent({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const menuId = Number(id);

  const item = menuData.find((m: any) => m.id === menuId);

  if (!item) {
    notFound();
  }

  const [jumlah, setJumlah] = useState(1);
  const [isFavorit, setIsFavorit] = useState(false);

  useEffect(() => {
    const dataFav = localStorage.getItem("favorit");
    if (dataFav) {
      const favoritIds: number[] = JSON.parse(dataFav);
      setIsFavorit(favoritIds.includes(menuId));
    }
  }, [menuId]);

  const toggleFavorit = () => {
    const dataFav = localStorage.getItem("favorit");
    let favoritIds: number[] = dataFav ? JSON.parse(dataFav) : [];

    if (isFavorit) {
      favoritIds = favoritIds.filter((favId) => favId !== menuId);
    } else {
      favoritIds.push(menuId);
    }

    localStorage.setItem("favorit", JSON.stringify(favoritIds));
    setIsFavorit(!isFavorit);
  };

  // Fungsi Tambah ke Keranjang dengan Validasi Stok (Poin 8, 9, & 15)
  const handleTambahKeranjang = () => {
    const keranjangLama = JSON.parse(localStorage.getItem("keranjang") || "[]");
    const itemAda = keranjangLama.find(
      (cartItem: any) => cartItem.id === menuId,
    );
    const jumlahDiKeranjang = itemAda ? itemAda.jumlah : 0;
    const totalAkanDibeli = jumlahDiKeranjang + jumlah;

    if (totalAkanDibeli > item.stok) {
      alert(
        `Gagal! Jumlah di keranjang melebihi stok yang tersedia (Sisa stok: ${item.stok - jumlahDiKeranjang})`,
      );
      return;
    }

    let keranjangBaru;
    if (itemAda) {
      keranjangBaru = keranjangLama.map((cartItem: any) =>
        cartItem.id === menuId
          ? { ...cartItem, jumlah: cartItem.jumlah + jumlah }
          : cartItem,
      );
    } else {
      keranjangBaru = [...keranjangLama, { id: menuId, jumlah }];
    }

    localStorage.setItem("keranjang", JSON.stringify(keranjangBaru));
    window.dispatchEvent(new Event("keranjang-berubah")); // Update badge navbar secara live

    alert("Ditambahkan ke keranjang.");
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">
      {/* Tombol Kembali ke Daftar Menu */}
      <Link
        href="/menu"
        className="inline-flex items-center text-blue-600 text-sm font-semibold hover:underline bg-blue-50 px-4 py-2 rounded-xl transition-all"
      >
        ← Kembali ke Daftar Menu
      </Link>

      <div className="bg-white p-6 md:p-8 rounded-3xl border border-slate-100 shadow-sm flex flex-col md:flex-row gap-8">
        <div className="flex-1 space-y-4">
          <div className="flex justify-between items-start">
            <div>
              <span className="text-xs bg-slate-100 text-slate-600 px-3 py-1 rounded-full font-medium">
                {item.kategori}
              </span>
              <h1 className="text-3xl font-extrabold text-slate-800 mt-2">
                {item.nama}
              </h1>
            </div>
            <button
              onClick={toggleFavorit}
              className={`p-3 rounded-full border transition-all ${
                isFavorit
                  ? "bg-red-50 border-red-200 text-red-500"
                  : "bg-slate-50 border-slate-200 text-slate-400"
              }`}
            >
              ❤️
            </button>
          </div>

          <p className="text-2xl font-extrabold text-blue-600">
            {rupiah(item.harga)}
          </p>

          <p
            className={`text-sm font-semibold ${item.stok > 0 ? "text-emerald-600" : "text-red-600"}`}
          >
            {item.stok > 0 ? `Stok tersedia: ${item.stok}` : "Stok Habis"}
          </p>

          {/* Kontrol Jumlah & Tombol Keranjang */}
          <div className="pt-4 space-y-4">
            <div className="flex items-center gap-3">
              <span className="text-sm font-medium text-slate-600">
                Jumlah:
              </span>
              <div className="flex items-center border rounded-xl overflow-hidden bg-slate-50">
                <button
                  onClick={() => setJumlah(Math.max(1, jumlah - 1))}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 font-bold text-slate-700 transition-all"
                >
                  -
                </button>
                <span className="px-5 py-2 font-semibold text-sm text-slate-800">
                  {jumlah}
                </span>
                <button
                  onClick={() => setJumlah(jumlah + 1)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 font-bold text-slate-700 transition-all"
                >
                  +
                </button>
              </div>
            </div>

            {/* Total harga langsung berubah */}
            <p className="text-sm text-slate-600">
              Total Harga:{" "}
              <span className="font-bold text-slate-800">
                {rupiah(item.harga * jumlah)}
              </span>
            </p>

            <button
              disabled={item.stok <= 0}
              onClick={handleTambahKeranjang}
              className={`w-full py-3.5 rounded-xl font-bold text-white transition-all shadow-sm ${
                item.stok > 0
                  ? "bg-blue-600 hover:bg-blue-700"
                  : "bg-slate-300 cursor-not-allowed"
              }`}
            >
              🛒 Masukkan ke Keranjang
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function DetailMenu({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  return (
    <Suspense
      fallback={
        <div className="p-8 text-center text-slate-500">
          Memuat detail menu...
        </div>
      }
    >
      <DetailContent params={params} />
    </Suspense>
  );
}
