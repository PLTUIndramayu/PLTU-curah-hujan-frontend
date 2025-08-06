"use client";

import { Card, CardContent } from "@mui/material";
import { Button } from "@mui/material";
import {
  BarChart3,
  FilePlus2,
  LayoutDashboard,
  LogOutIcon,
} from "lucide-react";
import { useEffect, useState } from "react";
import { Header } from "../component/header";

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

  const [openDialog, setOpenDialog] = useState(false);

  return (
    <>
      <div className="p-6 space-y-6">
        <Header />

        <div>
          <p className="pl-5 pt-5 text-muted-foreground">
            Selamat datang di Sistem Monitoring Curah Hujan. Silakan pilih opsi
            di bawah ini.
          </p>
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
                onClick={() => (window.location.href = "/input-data")}
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
              <Button
                variant="contained"
                sx={{ mt: 3, textTransform: "none" }}
                className="mt-4 w-full"
              >
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
              <Button
                variant="contained"
                sx={{ mt: 3, textTransform: "none" }}
                className="mt-4 w-full"
              >
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
              <p className="text-sm text-muted-foreground pt-4">
                Total Stasiun
              </p>
              <div className="text-xl font-bold py-3">
                {stats.totalStations}
              </div>
            </div>
            <div className="border border-gray-200 pl-8 rounded-xl">
              <p className="text-sm text-muted-foreground pt-4">
                Data Bulan Ini
              </p>
              <div className="text-xl font-bold pt-3">{stats.totalData}</div>
            </div>
            <div className="border border-gray-200 pl-8 rounded-xl">
              <p className="text-sm text-muted-foreground pt-4">
                Curah Hujan Tertinggi
              </p>
              <div className="text-xl font-bold pt-3">
                {stats.maxRainfall} mm
              </div>
            </div>
          </div>

          {/* Dummy chart area */}
          <div className="h-40 bg-white rounded-md shadow-inner flex items-center justify-center text-muted-foreground">
            Tren Curah Hujan 7 Hari Terakhir (dummy chart)
          </div>
        </div>
      </div>
      <div>
        <Button
          variant="contained"
          onClick={() => setOpenDialog(true)}
          className="bg-red-500 text-white px-4 py-2 rounded flex items-center gap-2"
        >
          <LogOutIcon />
          Logout
        </Button>

        {/* Confirmation Dialog */}
        <Card
          sx={{
            display: openDialog ? "block" : "none",
            position: "fixed",
            top: "50%",
            left: "50%",
            zIndex: 50,
            transform: "translate(-50%, -50%)",
            minWidth: 320,
            boxShadow: 24,
            borderRadius: "12px",
          }}
        >
          <CardContent className="p-6 flex flex-col items-center">
            <h3 className="text-lg font-semibold mb-2">Konfirmasi Logout</h3>
            <p className="text-sm text-muted-foreground mb-6">
              Apakah Anda yakin ingin logout?
            </p>
            <div className="flex gap-4">
              <Button
                variant="contained"
                color="error"
                onClick={() => {
                  localStorage.removeItem("token");
                  window.location.href = "/login";
                }}
              >
                Logout
              </Button>
              <Button variant="outlined" onClick={() => setOpenDialog(false)}>
                Batal
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
