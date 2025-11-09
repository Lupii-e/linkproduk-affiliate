/** @type {import('tailwindcss').Config} */
const colors = require('tailwindcss/colors');

module.exports = {
  darkMode: ["class"],
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './src/**/*.{js,ts,jsx,tsx,mdx}',
	],
  prefix: "",
  theme: {
    container: { /* ... (kode container) ... */ },
    extend: {
      fontFamily: {
        sans: ['var(--font-stack-sans)', 'sans-serif'],
        // TAMBAHKAN FONT BARU: 'poppins'
        poppins: ['var(--font-poppins)', 'sans-serif'], 
      },
      colors: {
        // ... (semua kode warna Anda) ...
        gray: colors.gray, 
        slate: colors.slate, 
        border: "var(--border)",
        input: "var(--input)",
        ring: "var(--ring)",
        background: "var(--background)",
        foreground: "var(--foreground)",
        primary: { DEFAULT: "var(--primary)", foreground: "var(--primary-foreground)", },
        secondary: { DEFAULT: "var(--secondary)", foreground: "var(--secondary-foreground)", },
        destructive: { DEFAULT: "var(--destructive)", foreground: "var(--destructive-foreground)", },
        muted: { DEFAULT: "var(--muted)", foreground: "var(--muted-foreground)", },
        accent: { DEFAULT: "var(--accent)", foreground: "var(--accent-foreground)", },
        popover: { DEFAULT: "var(--popover)", foreground: "var(--popover-foreground)", },
        card: { DEFAULT: "var(--card)", foreground: "var(--card-foreground)", },
      },
      borderRadius: { /* ... (kode border radius) ... */ },
      keyframes: {
        // ... (kode keyframes Anda, termasuk fade-in-up) ...
        "accordion-down": { from: { height: "0" }, to: { height: "var(--radix-accordion-content-height)" }, },
        "accordion-up": { from: { height: "var(--radix-accordion-content-height)" }, to: { height: "0" }, },
        'fade-in-up': { '0%': { opacity: '0', transform: 'translateY(10px)' }, '100%': { opacity: '1', transform: 'translateY(0)' }, },
        'dreamy-gradient': { '0%': { 'background-position': '0% 50%' }, '50%': { 'background-position': '100% 50%' }, '100%': { 'background-position': '0% 50%' }, }
      },
      animation: {
        // ... (kode animation Anda, termasuk fade-in-up) ...
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        'fade-in-up': 'fade-in-up 0.75s ease-out forwards',
        'dreamy-gradient': 'dreamy-gradient 15s ease infinite'
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
}