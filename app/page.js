import clientPromise from "../lib/mongodb";
import ProductContainer from "../components/ProductContainer"; 
import { Inter } from 'next/font/google';

const inter = Inter({ subsets: ['latin'] });

export default async function Page() {

  let products = [];
  try {
    const client = await clientPromise;
    const db = client.db("db_afiliasi"); // <-- Pastikan nama DB Anda benar
    
    // FIX PENTING: Hanya ambil produk yang memiliki nama dan pastikan itu array yang valid
    products = await db
      .collection("products")
      .find({ nama_produk: { $ne: null, $ne: "" } }) // Filter data rusak saat build
      .sort({ _id: -1 })
      .toArray();

    // Verifikasi final: jika bukan array, jadikan array kosong
    if (!Array.isArray(products)) {
        products = [];
    }

  } catch (e) {
    console.error("Gagal fetch produk di homepage:", e);
    // Jika fetch gagal (misalnya koneksi), products tetap array kosong
  }

  // Next.js memerlukan JSON.parse(JSON.stringify()) untuk data yang dikirim dari Server ke Client Component
  const initialProductsSafe = JSON.parse(JSON.stringify(products));

  // Render halaman
  return (
    <main className={`${inter.className} flex min-h-screen flex-col items-center p-4 pt-12 bg-background text-foreground`}>
      
      {/* Bagian Header (Logo & Judul) */}
      <div className="text-center mb-8">
        <div className="w-24 h-24 bg-muted rounded-full mx-auto mb-4 flex items-center justify-center">
          <span className="text-muted-foreground">Foto profil</span>
        </div>
        <h1 className="text-3xl font-bold tracking-tight">LINKPRODUK</h1>
        <p className="text-muted-foreground">Koleksi produk unik dan menarik</p>
      </div>

      {/* Komponen Live Search dan Grid Produk */}
      <ProductContainer initialProducts={initialProductsSafe} />

    </main>
  );
}