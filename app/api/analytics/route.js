import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';

// --- FUNGSI GET (Mengambil data statistik utama) ---
export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db("db_afiliasi"); // <-- Pastikan nama DB ini benar!

    // 1. Ambil Total Klik
    const clickData = await db.collection("products").aggregate([
      {
        $group: {
          _id: null,
          totalClicks: { $sum: "$click_count" }, // Hitung total dari semua field 'click_count'
        },
      },
    ]).toArray();

    // 2. Ambil Total Produk (untuk statistik)
    const totalProducts = await db.collection("products").countDocuments({});

    // 3. Ambil Produk dengan Klik Tertinggi
    const topProducts = await db.collection("products").find({})
        .sort({ click_count: -1 }) // Urutkan dari tertinggi ke terendah
        .limit(3)
        .toArray();

    const totalClicks = clickData.length > 0 ? clickData[0].totalClicks : 0;

    // 4. Kirim semua data kembali
    return NextResponse.json(
      {
        totalClicks: totalClicks,
        totalProducts: totalProducts,
        // Format output agar lebih rapi
        topProducts: topProducts.map(p => ({
            name: p.nama_produk, 
            clicks: p.click_count || 0
        }))
      }, 
      { status: 200 }
    );

  } catch (e) {
    console.error("Analytics API Error:", e);
    return NextResponse.json(
      { message: "Gagal memuat analitik", error: e.message },
      { status: 500 }
    );
  }
}