"use client";

import { Card, CardContent } from "@mui/material";
import { Button } from "@mui/material";
import {
  BarChart3,
  FilePlus2,
  LayoutDashboard,
  HelpCircle,
} from "lucide-react";
import { useEffect, useState } from "react";

export default function DashboardPage() {
  const [stats, setStats] = useState({
    totalStations: 0,
    totalData: 0,
    maxRainfall: 0,
    updatedAt: "",
  });

  useEffect(() => {
    setStats({
      totalStations: 24,
      totalData: 342,
      maxRainfall: 87,
      updatedAt: "15 Juni 2023",
    });
  }, []);

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center mt-8 pl-4 ">
        <div>
          <h1 className="text-2xl font-semibold">
            Sistem Monitoring Curah Hujan
          </h1>
          <p className="text-muted-foreground">
            Selamat datang di Sistem Monitoring Curah Hujan. Silakan pilih opsi
            di bawah ini.
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="flex items-center gap-2">
            <HelpCircle className="w-4 h-4" /> Bantuan
          </Button>
          <Button variant="ghost">Admin</Button>
        </div>
      </div>

      {/* Main Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-18 p-4">
        <Card className="text-center" sx={{ borderRadius: "12px" }}>
          <CardContent className="p-6">
            <FilePlus2 className="mx-auto h-10 w-10 text-blue-500" />
            <h2 className="mt-4 text-lg font-semibold">Input Data</h2>
            <p className="text-sm text-muted-foreground">
              Masukkan data curah hujan baru ke sistem.
            </p>
            <Button
              variant="contained"
              sx={{ mt: 3, textTransform: "none" }}
              className="mt-7 w-full"
            >
              Mulai Input
            </Button>
          </CardContent>
        </Card>
        <Card className="text-center" sx={{ borderRadius: "12px" }}>
          <CardContent className="p-6">
            <LayoutDashboard className="mx-auto h-10 w-10 text-blue-500" />
            <h2 className="mt-4 text-lg font-semibold">
              Lihat Data Curah Hujan
            </h2>
            <p className="text-sm text-muted-foreground">
              Akses data historis dari berbagai lokasi.
            </p>
            <Button sx={{ mt: 3 }} className="mt-4 w-full">
              Lihat Data
            </Button>
          </CardContent>
        </Card>
        <Card className="text-center" sx={{ borderRadius: "12px" }}>
          <CardContent className="p-6">
            <BarChart3 className="mx-auto h-10 w-10 text-blue-500" />
            <h2 className="mt-4 text-lg font-semibold">
              Lihat Grafik Curah Hujan
            </h2>
            <p className="text-sm text-muted-foreground">
              Visualisasi tren data curah hujan.
            </p>
            <Button sx={{ mt: 3 }} className="mt-4 w-full">
              Lihat Grafik
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Summary Section */}
      <div className="bg-muted p-6 rounded-xl">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">Ringkasan Data Terkini</h2>
          <span className="text-sm text-muted-foreground">
            Diperbarui: {stats.updatedAt}
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6 pt-4">
          <div className="border border-gray-200 pl-8 rounded-xl">
            <p className="text-sm text-muted-foreground pt-4">Total Stasiun</p>
            <div className="text-xl font-bold py-3">{stats.totalStations}</div>
          </div>
          <div className="border border-gray-200 pl-8 rounded-xl">
            <p className="text-sm text-muted-foreground pt-4">Data Bulan Ini</p>
            <div className="text-xl font-bold pt-3">{stats.totalData}</div>
          </div>
          <div className="border border-gray-200 pl-8 rounded-xl">
            <p className="text-sm text-muted-foreground pt-4">
              Curah Hujan Tertinggi
            </p>
            <div className="text-xl font-bold pt-3">{stats.maxRainfall} mm</div>
          </div>
        </div>

        {/* Dummy chart area */}
        <div className="h-40 bg-white rounded-md shadow-inner flex items-center justify-center text-muted-foreground">
          Tren Curah Hujan 7 Hari Terakhir (dummy chart)
        </div>
      </div>
    </div>
  );
}
