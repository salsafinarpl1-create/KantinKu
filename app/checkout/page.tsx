"use client";
import { useState, useEffect } from "react";
import { menuData, rupiah } from "@/data/menu";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function CheckoutPage() {
  const router = useRouter();
  const [keranjang, setKeranjang] = useState<any[]>([]);
  const [nama, setNama] = useState("");
  const [meja, setMeja] = useState("");
  const [metode, setMetode] = useState("Ambil Sendiri");
  const [promo, setPromo] = useState("");
  const [diskon, setDiskon] = useState(0);
  const [pesanPromo, setPesanPromo] = useState("");
  const [pesanError, setPesanError] = useState("");

  useEffect(() => {
    const dataCart = localStorage.getItem("keranjang");
    if (dataCart) {
      const items = JSON.parse(dataCart);
      const detailItems = items
        .map((cartItem: any) => {
          const menu = menuData.find((m: any) => m.id === cartItem.id);
          return { ...cartItem, menu };
        })
        .filter((item: any) => item.menu != null);
      setKeranjang(detailItems);
    }
  }, []);

  const subtotal = keranjang.reduce((sum, item) => {
    return sum + (item.menu ? item.menu.harga * item.jumlah : 0);
  }, 0);

  const handleCekPromo = () => {
    if (promo.trim().toUpperCase() === "HEMAT10") {
      if (subtotal >= 20000) {
        const potongan = subtotal * 0.1;
        setDiskon(potongan);
        setPesanPromo("🎉 Promo HEMAT10 berhasil digunakan! (Diskon 10%)");
      } else {
        setDiskon(0);
        setPesanPromo("❌ Minimal belanja untuk promo ini adalah Rp 20.000");
      }
    } else {
      setDiskon(0);
      setPesanPromo("❌ Kode promo tidak valid");
    }
  };

  const totalBayar = subtotal - diskon;

  const handleCheckoutSelesai = (e: React.FormEvent) => {
    e.preventDefault();
    setPesanError("");

    if (!nama || !meja) {
      setPesanError("Mohon lengkapi Nama dan Nomor Meja!");
      return;
    }

    if (keranjang.length === 0) {
      setPesanError("Keranjang masih kosong!");
      return;
    }

    let updatedMenuData = [...menuData];
    for (const item of keranjang) {
      const menuIndex = updatedMenuData.findIndex((m) => m.id === item.id);
      if (menuIndex !== -1) {
        if (item.jumlah > updatedMenuData[menuIndex].stok) {
          setPesanError(
            `Stok untuk ${updatedMenuData[menuIndex].nama} tidak mencukupi!`,
          );
          return;
        }
        updatedMenuData[menuIndex].stok -= item.jumlah;
      }
    }

    const pesananBaru = {
      nama,
      meja,
      metode,
      rincianMenu: keranjang.map(
        (i) =>
          `${i.jumlah}x ${i.menu.nama} (${rupiah(i.menu.harga * i.jumlah)})`,
      ),
      total: totalBayar,
      tanggal: new Date().toLocaleDateString("id-ID"),
    };

    const riwayatLama = JSON.parse(localStorage.getItem("riwayat") || "[]");
    localStorage.setItem(
      "riwayat",
      JSON.stringify([pesananBaru, ...riwayatLama]),
    );

    localStorage.removeItem("keranjang");
    window.dispatchEvent(new Event("keranjang-berubah"));

    // 🔴 TANPA POPUP ALERT: Langsung pindah ke halaman riwayat pesanan
    router.push("/riwayat");
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">
      <Link
        href="/keranjang"
        className="text-blue-600 text-sm font-semibold hover:underline"
      >
        ← Kembali ke Keranjang
      </Link>

      <h1 className="text-3xl font-extrabold text-slate-800">
        Checkout Pesanan 🚀
      </h1>

      {pesanError && (
        <div className="p-4 bg-red-50 border border-red-200 text-red-600 rounded-xl text-sm font-semibold">
          {pesanError}
        </div>
      )}

      <form
        onSubmit={handleCheckoutSelesai}
        className="grid grid-cols-1 md:grid-cols-3 gap-6"
      >
        <div className="md:col-span-2 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
          <h2 className="font-bold text-lg text-slate-800 border-b pb-3">
            Informasi Pemesan
          </h2>

          <div>
            <label className="block text-sm font-medium text-slate-600 mb-1">
              Nama Pemesan
            </label>
            <input
              type="text"
              required
              placeholder="Contoh: Budi Santoso"
              value={nama}
              onChange={(e) => setNama(e.target.value)}
              className="w-full px-4 py-2 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-600 mb-1">
              Nomor Meja / Kelas
            </label>
            <input
              type="text"
              required
              placeholder="Contoh: Meja 05 / Kelas 12 IPA 1"
              value={meja}
              onChange={(e) => setMeja(e.target.value)}
              className="w-full px-4 py-2 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-600 mb-1">
              Metode Pengambilan
            </label>
            <select
              value={metode}
              onChange={(e) => setMetode(e.target.value)}
              className="w-full px-4 py-2 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
            >
              <option value="Ambil Sendiri">Ambil Sendiri ke Kantin</option>
              <option value="Diantar ke Meja">Diantar ke Meja</option>
            </select>
          </div>

          <div className="pt-2 border-t space-y-2">
            <label className="block text-sm font-medium text-slate-600">
              Kode Promo (Opsional)
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Cth: HEMAT10"
                value={promo}
                onChange={(e) => setPromo(e.target.value)}
                className="flex-1 px-4 py-2 border rounded-xl text-sm uppercase focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                type="button"
                onClick={handleCekPromo}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-900 text-white font-semibold text-sm rounded-xl transition-all"
              >
                Gunakan
              </button>
            </div>
            {pesanPromo && (
              <p
                className={`text-xs font-semibold ${pesanPromo.includes("berhasil") ? "text-emerald-600" : "text-red-600"}`}
              >
                {pesanPromo}
              </p>
            )}
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4 h-fit">
          <h2 className="font-bold text-lg text-slate-800 border-b pb-3">
            Ringkasan Belanja
          </h2>

          <div className="space-y-2 max-h-48 overflow-y-auto text-sm text-slate-600 divide-y">
            {keranjang.map((item) => (
              <div key={item.id} className="pt-2 flex justify-between">
                <span>
                  {item.jumlah}x {item.menu.nama}
                </span>
                <span className="font-semibold">
                  {rupiah(item.menu.harga * item.jumlah)}
                </span>
              </div>
            ))}
          </div>

          <div className="border-t pt-3 space-y-1.5 text-sm">
            <div className="flex justify-between text-slate-500">
              <span>Subtotal</span>
              <span>{rupiah(subtotal)}</span>
            </div>
            {diskon > 0 && (
              <div className="flex justify-between text-emerald-600 font-semibold">
                <span>Diskon Promo</span>
                <span>- {rupiah(diskon)}</span>
              </div>
            )}
            <div className="flex justify-between font-extrabold text-lg text-slate-800 pt-2 border-t">
              <span>Total Bayar</span>
              <span className="text-blue-600">{rupiah(totalBayar)}</span>
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-center shadow-sm transition-all"
          >
            Konfirmasi Pesanan 🚀
          </button>
        </div>
      </form>
    </div>
  );
}
