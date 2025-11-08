// WAJIB: Komponen ini interaktif (Client Component)
"use client";

import { useState, useEffect } from 'react';
import Image from 'next/image'; 
import { Input } from "@/components/ui/input"; // Menggunakan input Shadcn
import { Search } from 'lucide-react'; 

// --- FUNGSI TYPEWRITER ---
const useTypewriterPlaceholder = (phrases, speed = 150) => {
    const [animatedText, setAnimatedText] = useState(''); 
    const [phraseIndex, setPhraseIndex] = useState(0);
    const [charIndex, setCharIndex] = useState(0);
    const [isDeleting, setIsDeleting] = useState(false);

    useEffect(() => {
        const currentPhrase = phrases[phraseIndex];
        let timer;

        if (!isDeleting && charIndex < currentPhrase.length) {
            timer = setTimeout(() => {
                setAnimatedText(prev => prev + currentPhrase[charIndex]);
                setCharIndex(charIndex + 1);
            }, speed);
        } else if (isDeleting && charIndex > 0) {
            timer = setTimeout(() => {
                setAnimatedText(prev => prev.substring(0, prev.length - 1));
                setCharIndex(charIndex - 1);
            }, speed / 2); 
        } else if (!isDeleting && charIndex === currentPhrase.length) {
            timer = setTimeout(() => setIsDeleting(true), 1500); 
        } else if (isDeleting && charIndex === 0) {
            setIsDeleting(false);
            setPhraseIndex(prev => (prev + 1) % phrases.length);
        }

        return () => clearTimeout(timer);
    }, [charIndex, isDeleting, phraseIndex, speed, phrases]);

    return animatedText; 
};

// --- Sub-Komponen: ProductCard (Fix Styling & Animasi) ---
function ProductCard({ product, index }) { // Menerima index untuk animasi
  
  const PLACEHOLDER_URL = 'https://i.imgur.com/g8T0t6a.png'; 
  const safeImageUrl = product.gambar_url || PLACEHOLDER_URL;

  const handleClick = async (e) => {
    e.preventDefault(); 
    fetch(`/api/click/${product._id}`, { method: 'POST' }).catch(err => console.error("Tracking failed:", err)); 
    window.open(product.link_affiliate, "_blank");
  };

  return (
    // FIX: Class styling lengkap untuk card, termasuk animasi
    <a
      href={product.link_affiliate}
      onClick={handleClick} 
      rel="noopener noreferrer"
      key={product._id.toString()}
      
      // STYLING CARD LENGKAP: Memastikan bg-card, border, dan w-full ada
      className="w-full bg-card rounded-lg shadow-md overflow-hidden border border-border 
                 transition-transform duration-300 hover:scale-[1.03] hover:shadow-xl
                 
                 /* ANIMASI BARU (Pastikan ini sesuai dengan tailwind.config.js) */
                 animate-fade-in-up opacity-0" // opacity-0 diperlukan agar elemen dimulai transparan
      
      // Inline style untuk Staggered Delay (membuat card muncul satu per satu)
      style={{ animationDelay: `${index * 0.1}s`, animationFillMode: 'forwards' }} // Perpanjang delay menjadi 0.1s
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
      <div className="p-3 text-left"> 
        <h3 className="text-foreground font-semibold text-sm line-clamp-2" title={product.nama_produk}>
          {product.nama_produk} 
        </h3>
      </div>
    </a>
  );
}


// --- Komponen Utama: ProductContainer (Fix Search Input & Grid) ---
export default function ProductContainer({ initialProducts }) {
    const [query, setQuery] = useState('');
    const [products, setProducts] = useState(initialProducts); 
    const [isLoading, setIsLoading] = useState(false);

    const suggestionPhrases = ["Sendal Biru...", "Meja Kerja...", "Sepatu Mahal...", "Produk Terbaik...."];
    const animatedPlaceholder = useTypewriterPlaceholder(suggestionPhrases); 

    // Efek Live Search
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

    const finalPlaceholder = `Cari ${animatedPlaceholder}`;

    return (
        <div className="w-full max-w-lg">
            
            {/* 1. SEARCH BAR (Input) */}
            <div className="w-full max-w-lg mb-8 relative">
                <Input
                  type="text"
                  placeholder={finalPlaceholder} 
                  value={query}
                  onChange={(e) => setQuery(e.target.value)} // FIX: Pastikan setQuery dipanggil
                  className="w-full p-4 rounded-lg bg-card border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary pl-10" 
                />
                <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
                
                {isLoading && <span className="absolute right-4 top-1/2 -translate-y-1/2 text-primary text-sm">Loading...</span>}
            </div>
            
            {/* 2. GRID PRODUK (Staggered Fade-In) */}
            <div className="grid grid-cols-2 gap-2 w-full max-w-lg"> 
                {products && products.map((product, index) => (
                  // Panggil ProductCard dan berikan index untuk delay animasi
                  // Hapus div pembungkus jika card itu sendiri sudah memiliki w-full
                  <ProductCard key={product._id.toString()} product={product} index={index} />
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