import { NextResponse } from 'next/server';
import clientPromise from '../../../lib/mongodb'; // Konektor database kita

// --- FUNGSI GET (Mengambil SEMUA produk) ---
export async function GET(request) {
  try {
    const client = await clientPromise;
    const db = client.db("db_afiliasi"); // <-- Ganti nama DB jika beda

    const products = await db
      .collection("products")
      .find({})
      .sort({ _id: -1 }) // Urutkan terbaru
      .toArray();

    return NextResponse.json(products, { status: 200 });
  } catch (e) {
    return NextResponse.json(
      { message: "Gagal mengambil produk", error: e.message },
      { status: 500 }
    );
  }
}

// --- FUNGSI POST (Menambah produk BARU) ---
export async function POST(request) {
  try {
    const client = await clientPromise;
    const db = client.db("db_afiliasi"); // <-- Ganti nama DB jika beda
    const produk = await request.json();

    const result = await db.collection("products").insertOne(produk);

    return NextResponse.json(
      { 
        message: "Produk berhasil ditambahkan", 
        productId: result.insertedId 
      }, 
      { status: 201 }
    );
  } catch (e) {
    return NextResponse.json(
      { message: "Gagal menambahkan produk", error: e.message }, 
      { status: 500 }
    );
  }
}