import { NextResponse } from 'next/server';
import clientPromise from '../../../../lib/mongodb';
import { ObjectId } from 'mongodb'; // Diperlukan untuk mencari ID di MongoDB

// --- FUNGSI DELETE (Menghapus produk berdasarkan ID) ---
export async function DELETE(request, { params }) {
  try {
    const id = params.id;
    
    // Validasi ID MongoDB
    if (!/^[0-9a-fA-F]{24}$/.test(id)) {
      return NextResponse.json(
        { message: "ID produk tidak valid" },
        { status: 400 } // Bad Request
      );
    }

    const client = await clientPromise;
    const db = client.db("db_afiliasi"); // Ganti nama DB jika berbeda

    // Hapus produk
    const result = await db.collection("products").deleteOne({
      _id: new ObjectId(id), // Cari menggunakan ObjectId
    });

    if (result.deletedCount === 0) {
      return NextResponse.json(
        { message: "Produk tidak ditemukan atau sudah terhapus" },
        { status: 404 } // Not Found
      );
    }

    return NextResponse.json(
      { message: `Produk ID ${id} berhasil dihapus` },
      { status: 200 } // OK
    );

  } catch (e) {
    console.error("DELETE Error:", e);
    return NextResponse.json(
      { message: "Gagal menghapus produk", error: e.message },
      { status: 500 } // Internal Server Error
    );
  }
}

// --- FUNGSI PATCH (Memperbarui produk berdasarkan ID) ---
export async function PATCH(request, { params }) {
  try {
    const id = params.id;
    
    // Validasi ID
    if (!/^[0-9a-fA-F]{24}$/.test(id)) {
      return NextResponse.json(
        { message: "ID produk tidak valid" },
        { status: 400 }
      );
    }

    // Ambil data yang dikirimkan untuk diupdate
    const updateData = await request.json();

    const client = await clientPromise;
    const db = client.db("db_afiliasi"); // Ganti nama DB jika berbeda

    // Update produk di database
    const result = await db.collection("products").updateOne(
      { _id: new ObjectId(id) }, // Cari berdasarkan ID
      { $set: updateData } // Terapkan update data
    );

    if (result.matchedCount === 0) {
      return NextResponse.json(
        { message: "Produk tidak ditemukan untuk diupdate" },
        { status: 404 }
      );
    }
    
    return NextResponse.json(
      { message: `Produk ID ${id} berhasil diperbarui` },
      { status: 200 } // OK
    );

  } catch (e) {
    console.error("PATCH Error:", e);
    return NextResponse.json(
      { message: "Gagal memperbarui produk", error: e.message },
      { status: 500 }
    );
  }
}