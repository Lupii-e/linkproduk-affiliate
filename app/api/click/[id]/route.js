import { NextResponse } from 'next/server';
import clientPromise from '../../../../lib/mongodb';
import { ObjectId } from 'mongodb';

// --- FUNGSI POST (Mencatat 1 Klik) ---
export async function POST(request, { params }) {
  try {
    const id = params.id;
    
    // 1. Validasi ID MongoDB
    if (!/^[0-9a-fA-F]{24}$/.test(id)) {
      return NextResponse.json({ message: "ID produk tidak valid" }, { status: 400 });
    }

    // 2. Koneksi ke Database
    const client = await clientPromise;
    const db = client.db("db_afiliasi"); // <-- Pastikan nama DB ini sama!

    // 3. Tambah 1 ke 'click_count'
    // Perintah $inc (increment) akan menambah 1 ke field click_count
    const result = await db.collection("products").updateOne(
      { _id: new ObjectId(id) },
      { $inc: { click_count: 1 } }, // <-- Operasi penambahan
      { upsert: true } // Buat field jika belum ada
    );

    if (result.matchedCount === 0) {
      return NextResponse.json(
        { message: "Produk tidak ditemukan atau tidak ada yang diupdate" },
        { status: 404 }
      );
    }

    // 4. Balasan sukses (ini akan diterima oleh homepage sebelum redirect)
    return NextResponse.json(
      { message: `Klik dicatat untuk ID ${id}` },
      { status: 200 }
    );

  } catch (e) {
    console.error("Click Tracking Error:", e);
    return NextResponse.json(
      { message: "Gagal mencatat klik", error: e.message },
      { status: 500 }
    );
  }
}