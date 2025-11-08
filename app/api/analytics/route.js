import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';

// FIX PENTING: Mencegah error build di Vercel
export const dynamic = 'force-dynamic';

// --- FUNGSI GET (Mengambil data statistik utama) ---
export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db("db_afiliasi"); // <-- Pastikan nama DB ini benar!
    const productCollection = db.collection("products");

    // 1. Ambil Total Klik (Menggunakan Agregasi Sederhana)
    const clickData = await productCollection.aggregate([
      {
        $group: {
          _id: null,
          // Hitung total dari semua field 'click_count' (jika field tidak ada, dianggap 0)
          totalClicks: { $sum: "$click_count" }, 
        },
      },
    ]).toArray();

    // 2. Ambil Total Produk Aktif
    const totalProducts = await productCollection.countDocuments({});

    // 3. Ambil Produk dengan Klik Tertinggi
    const topProducts = await productCollection.find({})
        .sort({ click_count: -1 }) // Urutkan dari tertinggi ke terendah
        .limit(3)
        .toArray();

    const totalClicks = clickData.length > 0 ? clickData[0].totalClicks : 0;

    // 4. Kirim semua data kembali
    return NextResponse.json(
      {
        totalClicks: totalClicks,
        totalProducts: totalProducts,
        // Map data top produk dengan aman
        topProducts: topProducts.map(p => ({
            name: p.nama_produk || "Produk Tanpa Nama", // Fallback untuk nama
            clicks: p.click_count || 0 // Fallback untuk klik
        }))
      }, 
      { status: 200 }
    );

  } catch (e) {
    console.error("Analytics API Error (Vercel Build):", e);
    // Kembalikan data fallback jika ada error koneksi/agregasi
    return NextResponse.json(
      { totalClicks: 0, totalProducts: 0, topProducts: [] },
      { status: 200 } // Kembalikan 200 OK dengan data kosong agar frontend tidak crash
    );
  }
}