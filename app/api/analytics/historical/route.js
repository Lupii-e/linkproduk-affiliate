export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb'; 
import { ObjectId } from 'mongodb'; // <-- Import yang benar

// Fungsi untuk mendapatkan tanggal awal berdasarkan filter (d=7, d=30, d=all)
function getStartDate(days) {
  if (days === 'all') {
    return null; 
  }
  const date = new Date();
  date.setDate(date.getDate() - parseInt(days)); 
  date.setHours(0, 0, 0, 0); 
  return date;
}

// --- FUNGSI GET (Mengambil data klik historis) ---
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const days = searchParams.get('d') || '7'; 

    const client = await clientPromise;
    const db = client.db("db_afiliasi"); // <-- Pastikan nama DB ini benar!

    let matchCondition = {};
    const startDate = getStartDate(days);

    // Filter berdasarkan _id MongoDB untuk mendapatkan rentang waktu
    if (startDate) {
        // Konversi tanggal ke ObjectId untuk filter (Hanya filter yang penting)
        const timestampInSeconds = Math.floor(startDate.getTime() / 1000);
        const startObjectIdHex = timestampInSeconds.toString(16) + "0000000000000000";
        
        // Menggunakan ObjectId yang sudah di-import
        matchCondition._id = { 
            $gte: new ObjectId(startObjectIdHex) 
        };
    }
    
    // Pipeline Agregasi untuk mengelompokkan data berdasarkan tanggal
    const pipeline = [
        { $match: matchCondition }, // 1. Filter berdasarkan rentang waktu
        {
            $project: {
                // 2. Proyeksikan _id ke format tanggal
                date: { $dateToString: { format: "%Y-%m-%d", date: { $toDate: "$_id" } } },
                click_count: 1, 
            },
        },
        {
            // 3. Kelompokkan klik berdasarkan tanggal dan hitung total per hari
            $group: {
                _id: "$date",
                totalClicks: { $sum: "$click_count" },
            },
        },
        { $sort: { _id: 1 } }, // 4. Urutkan berdasarkan tanggal
        {
            // 5. Format ulang output
            $project: {
                _id: 0,
                date: "$_id",
                clicks: "$totalClicks",
            }
        }
    ];

    // Jalankan agregasi
    const historicalData = await db.collection("products").aggregate(pipeline).toArray();

    return NextResponse.json(historicalData, { status: 200 });

  } catch (e) {
    console.error("Historical Analytics API Error:", e);
    return NextResponse.json(
      { message: "Gagal memuat data historis", error: e.message },
      { status: 500 }
    );
  }
}