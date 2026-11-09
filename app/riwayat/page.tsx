"use client";
import { useState, useEffect } from "react";
import { menuData, rupiah } from "@/data/menu"; // 👈 Ubah 'menu' menjadi 'menuData'
import Link from "next/link";

export default function RiwayatPage() {
  const [riwayatPesanan, setRiwayatPesanan] = useState<any[]>([]);

  useEffect(() => {
    const dataRiwayat = localStorage.getItem("riwayat");
    if (dataRiwayat) {
      setRiwayatPesanan(JSON.parse(dataRiwayat));
    }
  }, []);

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">
      <Link
        href="/menu"
        className="text-blue-600 text-sm font-semibold hover:underline"
      >
        ← Kembali ke Daftar Menu
      </Link>

      <h1 className="text-2xl font-bold text-slate-800">Riwayat Pesanan 📦</h1>

      {riwayatPesanan.length === 0 ? (
        <p className="text-slate-500">Belum ada riwayat pesanan.</p>
      ) : (
        <div className="space-y-4">
          {riwayatPesanan.map((pesanan, index) => (
            <div
              key={index}
              className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-3"
            >
              <div className="flex justify-between items-center border-b pb-3">
                <h3 className="font-bold text-slate-800">
                  Pemesan: {pesanan.nama}
                </h3>
                <span className="text-xs bg-blue-50 text-blue-600 px-3 py-1 rounded-full font-semibold">
                  Selesai
                </span>
              </div>

              <ul className="text-sm text-slate-600 space-y-1">
                {pesanan.rincianMenu?.map((itemStr: string, idx: number) => (
                  <li key={idx}>• {itemStr}</li>
                ))}
              </ul>

              <div className="border-t pt-3 flex justify-between font-bold text-slate-800">
                <span>Total Bayar:</span>
                <span className="text-blue-600">{rupiah(pesanan.total)}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
