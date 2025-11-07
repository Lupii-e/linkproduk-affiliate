import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import { ObjectId } from 'mongodb'; 

// PENTING: Menghindari Build Error di Vercel
export const dynamic = 'force-dynamic';

// --- FUNGSI GET (Mencari produk menggunakan Atlas Search) ---
export async function GET(request) {
  try {
    // FIX: Menggunakan request.url memaksa render dinamis
    const { searchParams } = new URL(request.url); 
    const query = searchParams.get('q');

    if (!query) {
      return NextResponse.json(
        { message: "Query pencarian (q) dibutuhkan" }, { status: 400 }
      );
    }

    const client = await clientPromise;
    const db = client.db("db_afiliasi"); 

    // Ini adalah Pipeline untuk Atlas Search
    const pipeline = [
      {
        $search: {
          index: "search_produk", // <-- Ganti jika nama Indeks Search Anda beda
          "autocomplete": {
            "query": query,
            "path": "nama_produk", 
            "fuzzy": { "maxEdits": 1 } 
          }
        }
      },
      {
        // FIX: Hanya kembalikan produk yang memiliki URL gambar yang valid
        $match: {
          gambar_url: { $ne: null, $ne: "" } 
        }
      },
      { $limit: 10 },
      {
        $project: {
          _id: 1,
          nama_produk: 1,
          kategori: 1,
          harga: 1,
          gambar_url: 1, 
          link_affiliate: 1,
          click_count: 1
        }
      }
    ];

    const products = await db.collection("products").aggregate(pipeline).toArray();

    return NextResponse.json(products, { status: 200 });

  } catch (e) {
    console.error("Search API Error:", e);
    return NextResponse.json(
      { message: "Gagal melakukan pencarian", error: e.message },
      { status: 500 }
    );
  }
}