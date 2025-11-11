import './globals.css'
// 1. Ganti import font
import { Montserrat } from 'next/font/google'; 

// 2. Konfigurasi Montserrat
const montserrat = Montserrat({ 
  subsets: ['latin'],
  variable: '--font-montserrat', // Definisikan CSS variable baru
  weight: ['400', '500', '600', '700'], // Ambil weight 400 (regular), 500 (medium), 700 (bold)
});

export const metadata = {
  title: 'Link Produk', 
  description: 'Koleksi produk',
};

export default function RootLayout({ children }) {
  return (
    <html lang="id" className="dark"> 
      <body 
        // 3. Terapkan variabel baru
        className={`${montserrat.variable} text-foreground font-sans bg-background`} 
        suppressHydrationWarning
      >
        {children}
      </body>
    </html>
  )
}