// components/DynamicChart.js
"use client";

import dynamic from 'next/dynamic';
import React from 'react';

// Import ChartComponent secara dinamis (hanya di sisi client)
const LazyChart = dynamic(() => import('./ChartComponent'), {
  ssr: false, // TIDAK PERLU di-render oleh Server (ini mengatasi bug)
  loading: () => <div className="w-full h-[350px] flex items-center justify-center text-muted-foreground border border-dashed rounded-lg">Memuat Chart...</div>,
});

// Komponen ini menerima data dan props lainnya
export default function DynamicChart({ data }) {
  // Hanya tampilkan chart jika ada data
  if (!data || data.length === 0) {
    return (
        <div className="w-full h-[350px] flex items-center justify-center text-muted-foreground border border-dashed rounded-lg">
            Data tidak tersedia untuk periode ini.
        </div>
    );
  }

  return <LazyChart data={data} />;
}