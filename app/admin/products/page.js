// WAJIB: Menggunakan 'use client' karena halaman ini interaktif
"use client";

import { useState, useEffect } from 'react';
// Import Komponen Dasar Shadcn
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

// Import Komponen Table
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"; 

// Import Komponen Dialog & Alert
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

// Import Ikon
import { Search, Pencil, Trash2 } from 'lucide-react'; 


export default function ProductsPage() { 

  // === STATE UTAMA ===
  const emptyForm = {
    nama_produk: '',
    link_affiliate: '',
    gambar_url: '',
  };
  const [formData, setFormData] = useState(emptyForm);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');
  
  // State untuk Fitur EDIT
  const [editingProduct, setEditingProduct] = useState(null); 


  // === STATE UNTUK TABEL & PENCARIAN ===
  const [products, setProducts] = useState([]);
  const [isTableLoading, setIsTableLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState(''); 


  // === 1. FUNGSI UNTUK MENGAMBIL DATA PRODUK (REFRESH TABEL) ===
  const fetchProducts = async () => {
    setIsTableLoading(true);
    try {
      const res = await fetch('/api/produk'); 
      const data = await res.json();
      setProducts(data);
    } catch (error) {
      console.error("Gagal fetch produk:", error);
      setMessage("Gagal memuat daftar produk.");
    }
    setIsTableLoading(false);
  };

  // === EFEK: JALANKAN fetchProducts() SAAT HALAMAN DIBUKA ===
  useEffect(() => {
    fetchProducts();
  }, []); 

  // === 2. FUNGSI DELETE (HAPUS) PRODUK ===
  const handleDelete = async (productId) => {
    setMessage('');
    try {
      const response = await fetch(`/api/produk/${productId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setMessage(`Sukses! Produk ID ${productId} berhasil dihapus.`);
        await fetchProducts(); 
      } else {
        const result = await response.json();
        setMessage(`Gagal hapus: ${result.message}`);
      }
    } catch (error) {
      setMessage("Terjadi error saat menghapus.");
    }
  };


  // === 3. FUNGSI EDIT (Saat Tombol Edit di Tabel Diklik) ===
  const handleEdit = (product) => {
    // 1. Simpan data produk ke state 'editingProduct'
    setEditingProduct(product);
    
    // 2. Isi formulir dengan data produk tersebut
    setFormData({
      nama_produk: product.nama_produk,
      link_affiliate: product.link_affiliate,
      gambar_url: product.gambar_url,
    });
    setMessage('');
    
    // Scroll ke atas
    window.scrollTo({ top: 0, behavior: 'smooth' }); 
  };


  // === 4. FUNGSI FORMULIR (HANDLE TAMBAH ATAU UPDATE) ===
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage('');

    // Tentukan URL dan METHOD (POST untuk baru, PATCH untuk update)
    const method = editingProduct ? 'PATCH' : 'POST';
    const url = editingProduct 
      ? `/api/produk/${editingProduct._id}` // URL untuk UPDATE
      : '/api/produk'; // URL untuk TAMBAH BARU

    try {
      const response = await fetch(url, {
        method: method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (response.ok) {
        const successMessage = editingProduct 
          ? `Sukses! Produk "${formData.nama_produk}" diperbarui.`
          : `Sukses! Produk "${formData.nama_produk}" ditambahkan.`;
        
        setMessage(successMessage);
        
        // Kosongkan formulir & Reset state
        setFormData(emptyForm); 
        setEditingProduct(null); // Reset mode edit
        
        await fetchProducts(); 
      } else {
        setMessage(`Gagal: ${result.message}`);
      }
    } catch (error) {
      setMessage("Terjadi error di sisi klien.");
    } finally {
      setIsLoading(false);
    }
  };


  // === 5. FILTER PRODUK UNTUK TABEL ===
  const filteredProducts = products.filter(product => 
    product.nama_produk.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // === TAMPILAN HALAMAN (JSX) ===
  return (
    <div className="w-full">
      
      {/* BAGIAN 1: FORMULIR TAMBAH / EDIT PRODUK (RESPONSIVE FIX) */}
      <div className="w-full max-w-md space-y-4 p-4 sm:p-6 border border-border bg-card rounded-lg mb-6 sm:mb-10">
        <h2 className="text-xl font-semibold">
            {editingProduct ? 'Edit Produk' : 'Tambah Produk Baru'}
        </h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid w-full items-center gap-1.5">
                <Label htmlFor="nama_produk">Nama Produk</Label>
                <Input id="nama_produk" name="nama_produk" value={formData.nama_produk} onChange={handleChange} required />
            </div>

            <div className="grid w-full items-center gap-1.5">
                <Label htmlFor="link_affiliate">Link Affiliate</Label>
                <Input id="link_affiliate" name="link_affiliate" type="url" value={formData.link_affiliate} onChange={handleChange} required />
            </div>

            <div className="grid w-full items-center gap-1.5">
                <Label htmlFor="gambar_url">URL Gambar (1:1)</Label>
                <Input id="gambar_url" name="gambar_url" type="url" value={formData.gambar_url} onChange={handleChange} required />
            </div>

            <Button type="submit" disabled={isLoading} className="w-full">
                {isLoading 
                    ? (editingProduct ? 'Memperbarui...' : 'Menyimpan...') 
                    : (editingProduct ? 'Update Produk' : 'Simpan Produk')}
            </Button>
            
            {/* Tombol Cancel Edit */}
            {editingProduct && (
                <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => {setEditingProduct(null); setFormData(emptyForm);}}
                    className="w-full mt-2"
                >
                    Batalkan Edit
                </Button>
            )}
        </form>

        {message && (
            <p className={`text-sm mt-4 ${message.startsWith('Gagal') ? 'text-destructive' : 'text-primary'}`}>
                {message}
            </p>
        )}
      </div>

      {/* GARIS PEMISAH */}
      <hr className="my-10 border-border" />

      {/* BAGIAN 2: DAFTAR PRODUK (TABEL) */}
      <h2 className="text-2xl font-bold mb-4">Kelola Produk ({products.length} Item)</h2>
      
      {/* Search Bar untuk Tabel */}
      <div className="relative mb-4 w-full max-w-md">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input 
          placeholder="Cari produk di tabel..." 
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-9"
        />
      </div>


      <div className="border border-border rounded-lg overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[200px]">Nama Produk</TableHead>
              <TableHead className="min-w-[200px]">Link Affiliate</TableHead>
              <TableHead className="w-[50px] text-right">Klik</TableHead>
              <TableHead className="w-[100px] text-right">Aksi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isTableLoading ? (
              <TableRow>
                <TableCell colSpan={4} className="text-center">Memuat data...</TableCell>
              </TableRow>
            ) : (
              filteredProducts.map((product) => (
                <TableRow key={product._id}>
                  <TableCell className="font-medium max-w-xs truncate">{product.nama_produk}</TableCell>
                  <TableCell className="text-muted-foreground truncate max-w-xs">
                    {product.link_affiliate}
                  </TableCell>
                   <TableCell className="text-right font-bold">
                    {product.click_count || 0} {/* Kolom Klik */}
                  </TableCell>
                  <TableCell className="text-right"> 
                    <div className="flex justify-end gap-2 min-w-[70px]"> 
                        
                        {/* Tombol EDIT */}
                        <Button 
                            variant="outline" 
                            size="icon" 
                            className="h-8 w-8"
                            onClick={() => handleEdit(product)}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        
                        {/* ALERT DIALOG UNTUK KONFIRMASI HAPUS */}
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button variant="destructive" size="icon" className="h-8 w-8">
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Anda Yakin?</AlertDialogTitle>
                              <AlertDialogDescription>
                                Tindakan ini tidak bisa dibatalkan. Ini akan menghapus produk "{product.nama_produk}" secara permanen.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Batal</AlertDialogCancel>
                              <AlertDialogAction 
                                onClick={() => handleDelete(product._id)}
                                className="bg-destructive hover:bg-red-700 text-destructive-foreground"
                              >
                                Ya, Hapus
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                        
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
            
            {/* Tampilkan pesan jika tidak ada hasil filter */}
            {!isTableLoading && products.length > 0 && filteredProducts.length === 0 && (
                <TableRow>
                    <TableCell colSpan={4} className="text-center text-muted-foreground">
                        Tidak ada produk yang cocok dengan pencarian.
                    </TableCell>
                </TableRow>
            )}

          </TableBody>
        </Table>
      </div>

    </div>
  );
}