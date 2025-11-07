import './globals.css'
import { Inter } from 'next/font/google' 

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'Link Produk Affiliate | Web Gen Z', // Judul Website Anda
  description: 'Koleksi produk unik dan terbaik untuk Gen Z.',
};

export default function RootLayout({ children }) {
  return (
    // Tambahkan className="dark" di sini untuk mengaktifkan Dark Mode
    <html lang="id" className="dark"> 
      {/* Suppress Hydration Error adalah praktik terbaik saat menggunakan Tailwind dengan Dark Mode */}
      <body 
        className={`${inter.className} bg-background text-foreground`}
        suppressHydrationWarning
      >
        {children}
      </body>
    </html>
  )
}