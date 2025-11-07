import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb'; 
import { ObjectId } from 'mongodb'; 

// PENTING: Menghindari Build Error di Vercel
export const dynamic = 'force-dynamic';

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
    // FIX: Menggunakan request.url memaksa render dinamis
    const { searchParams } = new URL(request.url); 
    const days = searchParams.get('d') || '7'; 

    const client = await clientPromise;
    const db = client.db("db_afiliasi"); 

    let matchCondition = {};
    const startDate = getStartDate(days);

    // Filter berdasarkan _id MongoDB untuk mendapatkan rentang waktu
    if (startDate) {
        const timestampInSeconds = Math.floor(startDate.getTime() / 1000);
        const startObjectIdHex = timestampInSeconds.toString(16) + "0000000000000000";
        
        matchCondition._id = { 
            $gte: new ObjectId(startObjectIdHex) 
        };
    }
    
    // Pipeline Agregasi untuk mengelompokkan data berdasarkan tanggal
    const pipeline = [
        { $match: matchCondition },
        {
            $project: {
                date: { $dateToString: { format: "%Y-%m-%d", date: { $toDate: "$_id" } } },
                click_count: 1, 
            },
        },
        {
            $group: {
                _id: "$date",
                totalClicks: { $sum: "$click_count" },
            },
        },
        { $sort: { _id: 1 } },
        {
            $project: {
                _id: 0,
                date: "$_id",
                clicks: "$totalClicks",
            }
        }
    ];

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