import clientPromise from "../lib/mongodb";
import ProductContainer from "../components/ProductContainer"; 
// Hapus import font lama

// Tetap gunakan ISR untuk update otomatis
export const revalidate = 60; 

export default async function Page() {

  let products = [];
  try {
    const client = await clientPromise;
    const db = client.db("db_afiliasi"); 
    
    products = await db
      .collection("products")
      .find({ nama_produk: { $ne: null, $ne: "" } }) 
      .sort({ _id: -1 })
      .toArray();

    if (!Array.isArray(products)) {
        products = [];
    }

  } catch (e) {
    console.error("Gagal fetch produk di homepage:", e);
  }

  const initialProductsSafe = JSON.parse(JSON.stringify(products));

  // Render halaman
  return (
    // FIX: Mengurangi padding atas (pt-12 -> pt-8)
    <main className={`flex min-h-screen flex-col items-center p-4 pt-8 bg-background text-foreground`}> 
      
      {/* WRAPPER UTAMA */}
      <div className="flex flex-col items-center w-full max-w-lg">
      
        {/* Bagian Header (Logo Rapat, Rata Kiri) */}
        <div className="flex items-center justify-start w-full mb-8">
          <div className="w-12 h-12 bg-muted rounded-full flex items-center justify-center flex-shrink-0">
            <span className="text-muted-foreground text-xs">Logo</span>
          </div>
          <div className="ml-4 text-left">
            <h1 className="text-xl font-bold tracking-tight">LINKPRODUK</h1>
            <p className="text-muted-foreground text-sm">Koleksi Produk</p>
          </div>
        </div>

        {/* Komponen Live Search dan Grid Produk */}
        <ProductContainer initialProducts={initialProductsSafe} />

      </div> {/* Tutup div wrapper */}
    </main>
  );
}