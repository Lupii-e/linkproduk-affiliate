import './globals.css'
import { Plus_Jakarta_Sans, Poppins } from 'next/font/google'; // <-- TAMBAHKAN Poppins

// Font utama (Plus Jakarta Sans)
const plusJakartaSans = Plus_Jakarta_Sans({ 
  subsets: ['latin'],
  variable: '--font-stack-sans', 
  weight: ['400', '600', '700'], 
});

// FONT BARU: Poppins (Hanya ambil weight 500)
const poppins = Poppins({
  subsets: ['latin'],
  variable: '--font-poppins', // Definisikan CSS variable baru
  weight: ['400'], // Ambil weight medium
});

export const metadata = {
  title: 'Link Produk Affiliate | Web Gen Z', 
  description: 'Koleksi produk unik dan terbaik untuk Gen Z.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="id" className="dark"> 
      <body 
        // Tambahkan variabel Poppins ke body
        className={`${plusJakartaSans.variable} ${poppins.variable} 
                   text-foreground font-sans bg-background`} 
        suppressHydrationWarning
      >
        {children}
      </body>
    </html>
  )
}