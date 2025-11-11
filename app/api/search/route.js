import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import { ObjectId } from 'mongodb'; 

// PENTING: Menghindari Build Error di Vercel
export const dynamic = 'force-dynamic';

// --- FUNGSI GET (Mencari produk menggunakan Atlas Search) ---
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url); 
    const query = searchParams.get('q');

    if (!query) {
      return NextResponse.json(
        { message: "Query pencarian (q) dibutuhkan" }, { status: 400 }
      );
    }

    const client = await clientPromise;
    const db = client.db("db_afiliasi"); 

    // --- PIPELINE BARU MENGGUNAKAN "COMPOUND" ---
    const pipeline = [
      {
        $search: {
          index: "search_produk", // Nama Indeks Search Anda
          "compound": {
            "should": [
              {
                // 1. SKOR TINGGI: Kecocokan Awalan (Untuk Kode "304")
                "autocomplete": {
                  "query": query,
                  "path": "nama_produk",
                  // Beri skor 10x lebih tinggi jika cocok di awalan
                  "score": { "boost": { "value": 10 } } 
                }
              },
              {
                // 2. SKOR NORMAL: Kecocokan Teks (Untuk Nama "Sepatu")
                "text": {
                  "query": query,
                  "path": "nama_produk",
                  "fuzzy": { "maxEdits": 1 } // Tetap izinkan salah ketik untuk nama
                }
              }
            ]
          }
        }
      },
      // --- AKHIR PIPELINE BARU ---
      {
        // Filter produk yang tidak punya URL gambar
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