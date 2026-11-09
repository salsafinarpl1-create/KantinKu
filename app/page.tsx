import Link from "next/link";
import { menuData } from "@/data/menu";
import MenuCard from "@/components/MenuCard";

export default function MenuPage() {
  return (
    <div className="max-w-6xl mx-auto px-4 py-12 space-y-12">
      {/* Bagian Hero / Sambutan Utama */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-500 rounded-3xl p-8 md:p-12 text-white shadow-lg flex flex-col md:flex-row items-center justify-between gap-8">
        <div className="space-y-4 text-center md:text-left">
          <span className="bg-blue-400/30 text-blue-100 text-xs font-bold px-3 py-1.5 rounded-full uppercase tracking-wider">
            Kantin Digital & Modern 🏫
          </span>
          <h1 className="text-3xl md:text-5xl font-extrabold leading-tight">
            Selamat Datang di <span className="text-yellow-300">KantinKu!</span>
          </h1>
          <p className="text-blue-100 text-sm md:text-base max-w-lg">
            Pesan makanan dan minuman favoritmu di kantin secara praktis, cepat,
            dan anti-antre. Nikmati sajian segar setiap hari langsung dari
            tempat dudukmu!
          </p>
          <div className="pt-2 flex flex-wrap justify-center md:justify-start gap-4">
            <Link
              href="/menu"
              className="bg-white text-blue-600 px-6 py-3 rounded-xl font-bold shadow-sm hover:bg-blue-50 transition-all text-sm"
            >
              🍽️ Jelajahi Menu
            </Link>
            <Link
              href="/keranjang"
              className="bg-blue-700/60 border border-blue-400/40 text-white px-6 py-3 rounded-xl font-bold hover:bg-blue-700 transition-all text-sm"
            >
              🛒 Lihat Keranjang
            </Link>
          </div>
        </div>

        {/* Ilustrasi atau Badge Cepat */}
        <div className="bg-white/10 backdrop-blur-md p-6 rounded-2xl border border-white/20 text-center space-y-3 min-w-[200px]">
          <div className="text-4xl">🚀</div>
          <h3 className="font-bold text-white text-base">Cepat & Praktis</h3>
          <p className="text-xs text-blue-100">
            Pesan sekarang, ambil atau nikmati langsung saat siap!
          </p>
        </div>
      </div>

      {/* Bagian Daftar Kartu Menu */}
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-extrabold text-slate-800">
            Daftar Menu Pilihan 🍜
          </h2>
        </div>

        {(!menuData || menuData.length === 0) ? (
          <div className="text-center py-12 text-slate-500 bg-white rounded-2xl border border-slate-100 shadow-sm">
            Belum ada menu yang tersedia.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {menuData.map((item: any) => (
              <MenuCard key={item.id} item={item} />
            ))}
          </div>
        )}
      </div>

      {/* Bagian Fitur / Keunggulan */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6 border-t border-slate-100">
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm space-y-2">
          <div className="text-2xl">🍜</div>
          <h3 className="font-bold text-slate-800 text-lg">Menu Variatif</h3>
          <p className="text-slate-500 text-sm">
            Pilihan makanan berat, jajanan, hingga minuman segar tersedia
            lengkap setiap hari.
          </p>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm space-y-2">
          <div className="text-2xl">❤️</div>
          <h3 className="font-bold text-slate-800 text-lg">Simpan Favorit</h3>
          <p className="text-slate-500 text-sm">
            Tandai makanan kesukaanmu agar lebih cepat dipesan kembali kapan
            saja.
          </p>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm space-y-2">
          <div className="text-2xl">📦</div>
          <h3 className="font-bold text-slate-800 text-lg">Riwayat Pesanan</h3>
          <p className="text-slate-500 text-sm">
            Pantau status pesanan dan cek kembali daftar belanjaanmu dengan
            mudah.
          </p>
        </div>
      </div>
    </div>
  );
}