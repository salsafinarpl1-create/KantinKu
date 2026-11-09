"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Navbar() {
  const pathname = usePathname();

  const navItems = [
    { name: "Beranda", path: "/" },
    { name: "Menu", path: "/menu" },
    { name: "Favorit", path: "/favorit" },
    { name: "Keranjang", path: "/keranjang" },
    { name: "Riwayat", path: "/riwayat" },
  ];

  return (
    <header className="bg-blue-600 text-white shadow-md">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <h1 className="text-xl font-bold tracking-wide">KantinKu</h1>
        <nav>
          <ul className="flex space-x-2 md:space-x-4">
            {navItems.map((item) => {
              const isActive = pathname === item.path;
              return (
                <li key={item.path}>
                  <Link
                    href={item.path}
                    className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                      isActive
                        ? "bg-blue-800 text-white font-bold underline"
                        : "text-blue-100 hover:bg-blue-500 hover:text-white"
                    }`}
                  >
                    {item.name}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
      </div>
    </header>
  );
}
