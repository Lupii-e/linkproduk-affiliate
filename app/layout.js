import './globals.css'
import { Plus_Jakarta_Sans } from 'next/font/google'; // (Atau font yang Anda gunakan)

const plusJakartaSans = Plus_Jakarta_Sans({ 
  subsets: ['latin'],
  variable: '--font-stack-sans', 
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
        // Hapus 'animate-dreamy-gradient' dan kembalikan 'bg-background'
        className={`${plusJakartaSans.variable} text-foreground font-sans bg-background`} 
        suppressHydrationWarning
      >
        {children}
      </body>
    </html>
  )
}