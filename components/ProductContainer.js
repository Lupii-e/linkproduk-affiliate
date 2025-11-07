// WAJIB: Komponen ini interaktif (Client Component)
"use client";

import { useState, useEffect } from 'react';
import Image from 'next/image'; 
import { Input } from "@/components/ui/input"; // Menggunakan input Shadcn untuk styling
import { Search } from 'lucide-react'; 

// --- Sub-Komponen: ProductCard ---
// Kartu produk yang langsung mengarahkan ke link affiliate sambil melacak klik
function ProductCard({ product }) {
  
  // URL placeholder yang aman
  const PLACEHOLDER_URL = 'https://i.imgur.com/g8T0t6a.png'; 
  
  // Tentukan URL yang akan digunakan (jika URL database kosong, pakai placeholder)
  const safeImageUrl = product.gambar_url || PLACEHOLDER_URL;

  // Fungsi Pelacakan Klik dan Redirect
  const handleClick = async (e) => {
    e.preventDefault(); // Hentikan aksi link default

    // 1. Panggil API Pelacakan Klik (Asynchronously di background)
    fetch(`/api/click/${product._id}`, {
      method: 'POST',
    }).catch(err => console.error("Tracking failed:", err)); 

    // 2. Langsung arahkan pengguna ke link affiliate
    window.open(product.link_affiliate, "_blank");
  };

  return (
    // Card Produk (Tag <a> memanggil handleClick)
    <a
      href={product.link_affiliate}
      onClick={handleClick} // Panggil fungsi pelacakan
      rel="noopener noreferrer"
      key={product._id.toString()}
      className="bg-card rounded-lg shadow-md overflow-hidden border border-border transition-all hover:scale-[1.02] hover:shadow-xl duration-200"
    >
      
      {/* BAGIAN GAMBAR YANG SUDAH DISEDERHANAKAN */}
      <div className="aspect-square w-full relative">
        <Image
          src={safeImageUrl} 
          alt={product.nama_produk()}
          fill 
          sizes="(max-width: 768px) 50vw, 33vw"
          style={{ objectFit: 'cover' }} 
          className="bg-muted"
          priority={false}
          // Tambahkan key untuk mengatasi caching Next.js yang membandel
          key={safeImageUrl} 
        />
      </div>
      
      {/* Bagian Judul */}
      <div className="p-3 text-center">
        <h3 className="text-foreground font-semibold text-sm truncate" title={product.nama_produk}>
          {product.nama_produk} 
        </h3>
      </div>
    </a>
  );
}


// --- Komponen Utama: ProductContainer ---
export default function ProductContainer({ initialProducts }) {
  const [query, setQuery] = useState('');
  const [products, setProducts] = useState(initialProducts); 
  const [isLoading, setIsLoading] = useState(false);

  // Efek ini "mendengar" ketikan di 'query'
  useEffect(() => {
    const timer = setTimeout(() => {
        
        if (query.length > 2) {
            setIsLoading(true);
            fetch(`/api/search?q=${query}`)
              .then(res => res.json())
              .then(data => {
                setProducts(data); 
                setIsLoading(false);
              })
              .catch(() => setIsLoading(false));

        } else {
            setIsLoading(false);
            setProducts(initialProducts); 
        }
    }, 300); 

    return () => clearTimeout(timer);
  
  }, [query, initialProducts]); 

  return (
    <div className="w-full max-w-lg">
      
      {/* 1. SEARCH BAR (Input) */}
      <div className="w-full max-w-lg mb-8 relative">
        <Input
          type="text"
          placeholder="CARI PRODUK ...."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full p-4 rounded-lg bg-card border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary pl-10" 
        />
        <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
        
        {/* Tampilkan loading di samping input */}
        {isLoading && <span className="absolute right-4 top-1/2 -translate-y-1/2 text-primary text-sm">Loading...</span>}
      </div>
      
      {/* 2. GRID PRODUK (Otomatis ter-filter) */}
      <div className="grid grid-cols-2 gap-4 w-full max-w-lg">
        {products.map((product) => (
          <ProductCard key={product._id.toString()} product={product} />
        ))}
      </div>

      {/* Pesan jika hasil pencarian kosong */}
      {products.length === 0 && query.length > 2 && !isLoading && (
        <div className="text-center text-muted-foreground col-span-2 p-10 border border-dashed rounded-lg">
          <p>😞 Produk tidak ditemukan yang cocok dengan **"{query}"**.</p>
        </div>
      )}
    </div>
  );
}