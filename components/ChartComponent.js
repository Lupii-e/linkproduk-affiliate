"use client";

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

// Komponen Chart yang akan responsif
export default function ChartComponent({ data }) {
  
  // Format Tooltip untuk tampilan yang lebih baik
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="p-2 bg-card border border-border rounded-md shadow-lg">
          <p className="text-sm font-semibold">{label}</p>
          <p className="text-primary text-sm">Total Klik: {payload[0].value}</p>
        </div>
      );
    }
    return null;
  };

  return (
    // ResponsiveContainer WAJIB untuk memastikan chart responsif di berbagai ukuran layar
    <div style={{ width: '100%', height: 350 }}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
          margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
        >
          {/* Garis-garis bantu di chart */}
          <CartesianGrid strokeDasharray="3 3" stroke="#333" /> 
          
          {/* Sumbu X (Tanggal) */}
          <XAxis dataKey="date" stroke="#999" fontSize={12} />
          
          {/* Sumbu Y (Jumlah Klik) */}
          <YAxis stroke="#999" fontSize={12} allowDecimals={false} />
          
          {/* Tooltip (kotak info saat hover) */}
          <Tooltip content={<CustomTooltip />} />
          
          {/* Bar Chart (Data sebenarnya) */}
          <Bar dataKey="clicks" fill="#34D399" radius={[4, 4, 0, 0]} /> 
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}