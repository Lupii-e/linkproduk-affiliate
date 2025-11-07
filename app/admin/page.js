// app/admin/page.js
"use client";

import { useState, useEffect } from 'react';
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button"; 
import { Loader2 } from 'lucide-react'; 
import DynamicChart from '@/components/DynamicChart'; // Import komponen CHART dinamis

// Daftar filter waktu yang tersedia
const TIME_FILTERS = [
    { label: '1 Hari', value: '1' },
    { label: '7 Hari', value: '7' },
    { label: '30 Hari', value: '30' },
    { label: 'Semua', value: 'all' },
];

export default function AnalyticsPage() {
  
  // State untuk data utama (Total Klik, Top Produk)
  const [analyticsData, setAnalyticsData] = useState({
    totalClicks: 0,
    totalProducts: 0,
    topProducts: [],
  });
  
  // State untuk data Chart (Klik Harian)
  const [chartData, setChartData] = useState([]);
  
  // State untuk filter waktu chart (Default 7 hari)
  const [timeFilter, setTimeFilter] = useState('7'); 
  
  const [isLoading, setIsLoading] = useState(true);

  // Efek 1: Fetch Data Utama & Data Chart (saat filter berubah)
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        // Ambil data utama (total klik, total produk)
        const mainRes = await fetch('/api/analytics');
        const mainData = await mainRes.json();
        setAnalyticsData(mainData);

        // Ambil data historis (untuk chart) berdasarkan filter waktu
        const chartRes = await fetch(`/api/analytics/historical?d=${timeFilter}`);
        const chartData = await chartRes.json();
        setChartData(chartData);
        
      } catch (error) {
        console.error("Failed to fetch analytics:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [timeFilter]); 

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">Dashboard Analitik 📈</h1>
      
      {isLoading ? (
        <div className="flex items-center space-x-2 text-primary">
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          <span>Memuat statistik...</span>
        </div>
      ) : (
        <div className="space-y-8">
          
          {/* Baris 1: Kartu Utama (Total Klik & Produk) */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="bg-card border-primary">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Klik Produk (Semua Waktu)</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-4xl font-bold text-primary">
                  {analyticsData.totalClicks.toLocaleString('id-ID')}
                </div>
                <p className="text-xs text-muted-foreground pt-1">
                  Jumlah total klik pada semua link affiliate.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-card">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Produk Aktif</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-4xl font-bold">
                  {analyticsData.totalProducts}
                </div>
                <p className="text-xs text-muted-foreground pt-1">
                  Item yang tersedia di homepage.
                </p>
              </CardContent>
            </Card>
          </div>
          
          {/* Baris 2: Chart Klik Harian (RESPONSIF) */}
          <Card className="bg-card">
            <CardHeader className="flex flex-row justify-between items-center flex-wrap gap-2"> 
              <CardTitle>Performa Klik Harian</CardTitle>
              {/* Filter Waktu */}
              <div className="space-x-1">
                {TIME_FILTERS.map(filter => (
                    <Button 
                        key={filter.value} 
                        // Style Tombol Filter yang Sudah Diperbaiki
                        className={`h-8 text-xs px-3 ${
                            timeFilter === filter.value 
                                ? 'bg-primary text-primary-foreground hover:bg-primary/90' 
                                : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
                        }`}
                        onClick={() => setTimeFilter(filter.value)}
                    >
                        {filter.label}
                    </Button>
                ))}
              </div>
            </CardHeader>
            <CardContent>
                {/* Komponen Chart Dynamic */}
                <DynamicChart data={chartData} />
            </CardContent>
          </Card>


          {/* Baris 3: Produk Paling Populer */}
          <Card className="bg-card">
            <CardHeader>
              <CardTitle>Top 3 Produk Populer 🔥</CardTitle>
            </CardHeader>
            <CardContent>
              {analyticsData.topProducts.length === 0 ? (
                  <p className='text-muted-foreground'>Belum ada klik yang tercatat.</p>
              ) : (
                  <ul className='space-y-3'>
                    {analyticsData.topProducts.map((p, index) => (
                      <li key={index} className="flex justify-between items-center border-b border-border/50 pb-2 last:border-b-0">
                        <span className='font-medium'>{index + 1}. {p.name}</span>
                        <span className='text-primary font-bold'>{p.clicks.toLocaleString('id-ID')} Klik</span>
                      </li>
                    ))}
                  </ul>
              )}
            </CardContent>
          </Card>
          
          <p className="text-sm text-muted-foreground pt-4">
             *Analisis Klik Harian
          </p>
        </div>
      )}
    </div>
  );
}