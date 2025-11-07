import './globals.css'
// FIX: Mengganti Stack Sans yang tidak ditemukan dengan Plus Jakarta Sans (Stabil)
import { Plus_Jakarta_Sans } from 'next/font/google'; 

const plusJakartaSans = Plus_Jakarta_Sans({ 
  subsets: ['latin'],
  variable: '--font-stack-sans', // Tetap gunakan variabel lama
  weight: ['400', '600', '700'], 
});

export const metadata = {
  title: 'Link Produk Affiliate | Web Gen Z', 
  description: 'Koleksi produk unik dan terbaik untuk Gen Z.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="id" className="dark"> 
      <body 
        // Menerapkan font variable dan class styling
        className={`${plusJakartaSans.variable} bg-background text-foreground font-sans`} 
        suppressHydrationWarning
      >
        {children}
      </body>
    </html>
  )
}