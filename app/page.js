import clientPromise from "../lib/mongodb";
import ProductContainer from "../components/ProductContainer"; 
// Hapus import font yang lama

// Tetap gunakan ISR untuk update otomatis
export const revalidate = 60; 

export default async function Page() {

  let products = [];
  try {
    const client = await clientPromise;
    const db = client.db("db_afiliasi"); 
    
    // FIX: Hanya ambil produk yang memiliki nama
    products = await db
      .collection("products")
      .find({ nama_produk: { $ne: null, $ne: "" } }) 
      .sort({ _id: -1 })
      .toArray();

    // FIX SYNTAX: Memastikan products adalah array sebelum di-map
    if (!Array.isArray(products)) {
        products = [];
    }

  } catch (e) {
    console.error("Gagal fetch produk di homepage:", e);
  }

  const initialProductsSafe = JSON.parse(JSON.stringify(products));

  // Render halaman
  return (
    <main className={`flex min-h-screen flex-col items-center p-4 pt-12 bg-background text-foreground`}>
      
      {/* BAGIAN HEADER (Logo Rapat, Rata Kiri) */}
      <div className="flex items-center justify-start w-full max-w-lg mb-8">
        <div className="w-12 h-12 bg-muted rounded-full flex items-center justify-center flex-shrink-0">
          <span className="text-muted-foreground text-xs">Logo</span>
        </div>
        <div className="ml-4 text-left">
          <h1 className="text-xl font-bold tracking-tight">LINKPRODUK</h1>
          <p className="text-muted-foreground text-sm">Koleksi Linkproduk</p>
        </div>
      </div>

      {/* Komponen Live Search dan Grid Produk */}
      <ProductContainer initialProducts={initialProductsSafe} />

    </main>
  );
}