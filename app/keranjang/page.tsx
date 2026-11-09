"use client";
import { useState, useEffect } from "react";
import { menuData, rupiah } from "@/data/menu";
import Link from "next/link";

export default function KeranjangPage() {
  const [keranjang, setKeranjang] = useState<any[]>([]);

  // Fungsi memuat data keranjang dari localStorage
  const loadKeranjang = () => {
    const dataCart = localStorage.getItem("keranjang");
    if (dataCart) {
      const items = JSON.parse(dataCart);
      // Gabungkan data keranjang dengan data menu asli (nama, harga, stok, dll)
      const detailItems = items.map((cartItem: any) => {
        const menu = menuData.find((m: any) => m.id === cartItem.id);
        return {
          ...cartItem,
          menu,
        };
      }).filter((item: any) => item.menu != null);
      
      setKeranjang(detailItems);
    } else {
      setKeranjang([]);
    }
  };

  useEffect(() => {
    loadKeranjang();

    // Dengarkan event kustom "keranjang-berubah" agar halaman ter-update otomatis
    window.addEventListener("keranjang-berubah", loadKeranjang);
    return () => window.removeEventListener("keranjang-berubah", loadKeranjang);
  }, []);

  // Fungsi mengubah jumlah (qty) item di keranjang dengan validasi stok
  const updateJumlah = (id: number, delta: number) => {
    const dataCart = localStorage.getItem("keranjang");
    if (!dataCart) return;

    let items = JSON.parse(dataCart);
    items = items.map((item: any) => {
      if (item.id === id) {
        const menu = menuData.find((m: any) => m.id === id);
        const jumlahBaru = item.jumlah + delta;
        // Pastikan jumlah minimal 1 dan tidak melebihi stok
        if (jumlahBaru > 0 && menu && jumlahBaru <= menu.stok) {
          return { ...item, jumlah: jumlahBaru };
        }
      }
      return item;
    });

    localStorage.setItem("keranjang", JSON.stringify(items));
    window.dispatchEvent(new Event("keranjang-berubah"));
    loadKeranjang();
  };

  // Fungsi menghapus item dari keranjang
  const hapusItem = (id: number) => {
    const dataCart = localStorage.getItem("keranjang");
    if (!dataCart) return;

    let items = JSON.parse(dataCart);
    const updated = items.filter((item: any) => item.id !== id);

    localStorage.setItem("keranjang", JSON.stringify(updated));
    window.dispatchEvent(new Event("keranjang-berubah"));
    loadKeranjang();
  };

  // Hitung total keseluruhan harga
  const totalHarga = keranjang.reduce((sum, item) => {
    return sum + (item.menu ? item.menu.harga * item.jumlah : 0);
  }, 0);

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">
      <div>
        <h1 className="text-3xl font-extrabold text-slate-800">Keranjang Belanja 🛒</h1>
        <p className="text-slate-500 mt-1">Periksa kembali pesanan makanan dan minumanmu sebelum checkout.</p>
      </div>

      {keranjang.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl border border-slate-100 shadow-sm space-y-3">
          <div className="text-4xl">🛒</div>
          <p className="text-slate-500 font-medium">Keranjang belanjaanmu masih kosong.</p>
          <Link
            href="/menu"
            className="inline-block bg-blue-600 text-white px-5 py-2.5 rounded-xl font-semibold text-sm hover:bg-blue-700 transition-all shadow-sm"
          >
            Cari Makanan Sekarang
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="bg-white rounded-2xl border border-slate-200 divide-y shadow-sm overflow-hidden">
            {keranjang.map((item) => (
              <div key={item.id} className="p-5 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div className="space-y-1">
                  <h3 className="font-bold text-lg text-slate-800">{item.menu.nama}</h3>
                  <p className="text-sm text-blue-600 font-semibold">{rupiah(item.menu.harga)}</p>
                </div>

                <div className="flex items-center gap-6 w-full md:w-auto justify-between">
                  {/* Kontrol Qty */}
                  <div className="flex items-center border rounded-xl overflow-hidden bg-slate-50">
                    <button
                      onClick={() => updateJumlah(item.id, -1)}
                      className="px-3 py-1 bg-slate-100 hover:bg-slate-200 font-bold text-slate-700"
                    >
                      -
                    </button>
                    <span className="px-4 py-1 font-semibold text-sm">{item.jumlah}</span>
                    <button
                      onClick={() => updateJumlah(item.id, 1)}
                      className="px-3 py-1 bg-slate-100 hover:bg-slate-200 font-bold text-slate-700"
                    >
                      +
                    </button>
                  </div>

                  <span className="font-extrabold text-slate-800 w-28 text-right">
                    {rupiah(item.menu.harga * item.jumlah)}
                  </span>

                  <button
                    onClick={() => hapusItem(item.id)}
                    className="text-red-500 hover:text-red-700 text-sm font-semibold"
                  >
                    Hapus
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Bagian Total & Checkout */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row justify-between items-center gap-4">
            <div>
              <p className="text-sm text-slate-500">Total Pembayaran:</p>
              <p className="text-2xl font-extrabold text-blue-600">{rupiah(totalHarga)}</p>
            </div>

            <Link
              href="/checkout"
              className="w-full md:w-auto px-8 py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-center shadow-sm transition-all"
            >
              Lanjut ke Checkout 🚀
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}