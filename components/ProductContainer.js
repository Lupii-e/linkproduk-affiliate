// WAJIB: Komponen ini interaktif (Client Component)
"use client";

import { useState, useEffect } from 'react';
import Image from 'next/image'; 
import { Input } from "@/components/ui/input"; 
import { Search } from 'lucide-react'; 

// --- Sub-Komponen: ProductCard ---
function ProductCard({ product }) {
  
  const PLACEHOLDER_URL = 'https://i.imgur.com/g8T0t6a.png'; 
  const safeImageUrl = product.gambar_url || PLACEHOLDER_URL;

  const handleClick = async (e) => {
    e.preventDefault(); 
    fetch(`/api/click/${product._id}`, { method: 'POST' }).catch(err => console.error("Tracking failed:", err)); 
    window.open(product.link_affiliate, "_blank");
  };

  return (
    <a
      href={product.link_affiliate}
      onClick={handleClick}
      rel="noopener noreferrer"
      key={product._id.toString()}
      className="bg-card rounded-lg shadow-md overflow-hidden border border-border transition-all hover:scale-[1.02] hover:shadow-xl duration-200"
    >
      
      {/* BAGIAN GAMBAR */}
      <div className="aspect-square w-full relative">
        <Image
          src={safeImageUrl} 
          alt={product.nama_produk}
          fill 
          sizes="(max-width: 768px) 50vw, 33vw"
          style={{ objectFit: 'cover' }} 
          className="bg-muted"
          priority={false}
          key={safeImageUrl} 
        />
      </div>
      
      {/* Bagian Judul (Rata Kiri, Dua Baris) */}
      <div className="p-3 text-left"> {/* Rata Kiri di sini */}
        <h3 className="text-foreground font-semibold text-sm line-clamp-2" title={product.nama_produk}>
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

  useEffect(() => {
    const timer = setTimeout(() => {
        if (query.length > 2) {
            setIsLoading(true);
            fetch(`/api/search?q=${query}`)
              .then(res => res.json())
              .then(data => {
                setProducts(Array.isArray(data) ? data : []); 
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
      
      {/* 2. GRID PRODUK (Gap Rapat) */}
      <div className="grid grid-cols-2 gap-2 w-full max-w-lg"> {/* <-- Ganti gap-4 menjadi gap-2 */}
        {products && products.map((product) => (
          <ProductCard key={product._id.toString()} product={product} />
        ))}
      </div>

      {/* Pesan jika hasil pencarian kosong */}
      {products.length === 0 && query.length > 2 && !isLoading && (
        <div className="text-center text-muted-foreground col-span-2 p-10 border border-dashed rounded-lg">
          <p>😞 Produk tidak ditemukan yang cocok dengan <span className="font-semibold">{`"${query}"`}</span>.</p>
        </div>
      )}
    </div>
  );
}