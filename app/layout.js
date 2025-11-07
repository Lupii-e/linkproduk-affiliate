import './globals.css'
// Hapus import font Inter

export const metadata = {
  title: 'Link Produk Affiliate | Web Gen Z', 
  description: 'Koleksi produk unik dan terbaik untuk Gen Z.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="id" className="dark"> 
      <body 
        className="bg-background text-foreground font-sans" /* <-- Tambahkan font-sans di sini */
        suppressHydrationWarning
      >
        {children}
      </body>
    </html>
  )
}