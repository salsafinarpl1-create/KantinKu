export const menuData = [
  {
    id: 1,
    nama: "Nasi Goreng Spesial",
    harga: 15000,
    stok: 10,
    kategori: "Makanan",
  },
  {
    id: 2,
    nama: "Mie Ayam",
    harga: 10000,
    stok: 8,
    kategori: "Makanan",
  },
  {
    id: 3,
    nama: "Es Teh Manis",
    harga: 3000,
    stok: 48,
    kategori: "Minuman",
  },
  {
    id: 4,
    nama: "Jus Alpukat",
    harga: 8000,
    stok: 0,
    kategori: "Minuman",
  },
  {
    id: 5,
    nama: "Pisang Goreng",
    harga: 5000,
    stok: 20,
    kategori: "Cemilan",
  },
  {
    id: 6,
    nama: "Risol Mayo",
    harga: 4000,
    stok: 3,
    kategori: "Cemilan",
  },
];

export function rupiah(n?: number) {
  return "Rp " + (n ?? 0).toLocaleString("id-ID");
}
