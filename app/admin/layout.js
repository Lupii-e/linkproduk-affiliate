// Kita butuh 'use client' untuk Sheet di mobile, tapi kita buat komponen terpisah
// Untuk file layout utama, kita bisa impor komponen-komponennya
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { 
  Sheet, 
  SheetContent, 
  SheetTrigger 
} from '@/components/ui/sheet';
import { Menu } from 'lucide-react'; // Ikon "hamburger"

// --- Komponen Pembantu: Menu Navigasi ---
function AdminNavMenu() {
  return (
    <nav className="flex flex-col gap-2 p-4">
      <h2 className="text-xl font-bold mb-4 text-foreground">Admin Panel</h2>
      
      {/* Link ke Halaman Analitik */}
      <Button asChild variant="ghost" className="justify-start">
        <Link href="/admin">
          Analitik
        </Link>
      </Button>

      {/* Link ke Halaman Produk */}
      <Button asChild variant="ghost" className="justify-start">
        <Link href="/admin/products">
          Produk
        </Link>
      </Button>
    </nav>
  );
}


export default function AdminLayout({ children }) {
  return (
    <div className="flex min-h-screen w-full bg-muted/40">
      
      {/* ============ 1. SIDEBAR DESKTOP ============ */}
      {/* Hanya muncul di layar 'md' (medium) ke atas */}
      <aside className="w-64 flex-col border-r bg-background hidden md:flex">
        <AdminNavMenu />
      </aside>

      {/* ============ 2. KONTEN UTAMA (Kanan) ============ */}
      <div className="flex flex-col flex-1">
        
        {/* -- 2a. HEADER MOBILE (Tombol Hamburger) -- */}
        {/* Hanya muncul di layar kecil */}
        <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b bg-background px-4 md:hidden">
          
          <Sheet> {/* Komponen Menu Geser */}
            <SheetTrigger asChild>
              <Button size="icon" variant="outline">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Buka menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="p-0 w-64">
              <AdminNavMenu /> {/* Panggil menu yang sama di Sheet */}
            </SheetContent>
          </Sheet>

          <h1 className="flex-1 text-lg font-semibold text-foreground">Admin Panel</h1>
        </header>

        {/* -- 2b. KONTEN HALAMAN -- */}
        <main className="flex flex-col flex-1 p-4 md:p-8 overflow-x-auto">
          {children}
        </main>
      </div>
    </div>
  );
}