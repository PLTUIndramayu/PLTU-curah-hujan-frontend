"use client";

import { Card, CardContent, Button } from "@mui/material";
import { BarChart3, FilePlus2, LayoutDashboard } from "lucide-react";
import { useState } from "react";
import { Header } from "../component/header";
import { useUsers } from "../api/user";
import { useCurahHujanAllData } from "../api/curah-hujan";
import dayjs from "dayjs";

export default function DashboardPage() {

  const rows = useCurahHujanAllData();

  const totalStasiun = new Set(rows?.map((r) => r.User?.kode_stasiun)).size;

  const bulanIni = rows.filter((r) => {
    const tanggal = dayjs(r.tanggal);
    return (
      tanggal.month() === dayjs().month() && tanggal.year() === dayjs().year()
    );
  }).length;

  const curahMax =
    rows.length > 0 ? Math.max(...rows.map((r) => r.curah_hujan)) : 0;

  const updatedAt =
    rows.length > 0
      ? dayjs(
          rows.reduce((latest, row) =>
            new Date(row.updatedAt) > new Date(latest.updatedAt) ? row : latest
          ).updatedAt
        ).format("DD MMM YYYY")
      : "-";

  return (
    <>
      <div className="p-6 space-y-6">
        <Header />
        <p className="pl-5 pt-5 text-muted-foreground">
          Selamat datang di Sistem Monitoring Curah Hujan. Silakan pilih opsi di
          bawah ini.
        </p>

        {/* Main Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6 p-4">
          <Card className="text-center" sx={{ borderRadius: "12px" }}>
            <CardContent className="p-6">
              <FilePlus2 className="mx-auto h-10 w-10 text-blue-500" />
              <h2 className="mt-4 text-lg font-semibold">Input Data</h2>
              <p className="text-sm text-muted-foreground">
                Masukkan data curah hujan baru ke sistem.
              </p>
              <Button
                variant="contained"
                sx={{ mt: 3 }}
                fullWidth
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
                Akses data historis curah hujan.
              </p>
              <Button
                variant="contained"
                sx={{ mt: 3 }}
                fullWidth
                onClick={() => (window.location.href = "/view-data")}
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
                sx={{ mt: 3 }}
                fullWidth
                onClick={() => (window.location.href = "/view-grafik")}
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
              Diperbarui: {updatedAt}
            </span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4">
            <div className="border border-gray-200 pl-8 rounded-xl">
              <p className="text-sm text-muted-foreground pt-4">
                Total Stasiun
              </p>
              <div className="text-xl font-bold py-3">{totalStasiun}</div>
            </div>
            <div className="border border-gray-200 pl-8 rounded-xl">
              <p className="text-sm text-muted-foreground pt-4">
                Data Bulan Ini
              </p>
              <div className="text-xl font-bold pt-3">{bulanIni}</div>
            </div>
            <div className="border border-gray-200 pl-8 rounded-xl">
              <p className="text-sm text-muted-foreground pt-4">
                Curah Hujan Tertinggi
              </p>
              <div className="text-xl font-bold pt-3">{curahMax} mm</div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
