"use client";

import {
  Card,
  CardContent,
  Button,
  useMediaQuery,
  Fab,
  Zoom,
  Tooltip,
} from "@mui/material";
import { BarChart3, FilePlus2, LayoutDashboard } from "lucide-react";
import {Footer} from "../component/footer"
import { Header } from "../component/header";
import { useCurahHujanAllData } from "../api/curah-hujan";
import dayjs from "dayjs";
import ProtectedRoute from "../component/ProtectedRoute";

export default function DashboardPage() {
  const rows = useCurahHujanAllData();
  const isMobile = useMediaQuery("(max-width:600px)");

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
    <ProtectedRoute>
      <div className={`p-4 ${isMobile ? "space-y-4" : "sm:p-6 space-y-6"}`}>
        <Header />
        <p
          className={`pt-4 ${
            isMobile ? "pl-1 text-sm" : "pl-5 text-base"
          } text-muted-foreground`}
        >
          Selamat datang di Sistem Monitoring Curah Hujan. Silakan pilih opsi di
          bawah ini.
        </p>

        {/* Main Actions */}
        <div
          className={`grid gap-4 ${
            isMobile ? "grid-cols-1" : "md:grid-cols-3 sm:gap-6 mt-6 p-2 sm:p-4"
          }`}
        >
          {/* Input Data */}
          <Card className="text-center" sx={{ borderRadius: "12px" }}>
            <CardContent className="p-4 sm:p-6">
              <FilePlus2 className="mx-auto h-8 w-8 sm:h-10 sm:w-10 text-blue-500" />
              <h2 className="mt-3 sm:mt-4 text-base sm:text-lg font-semibold">
                Input Data
              </h2>
              <p className="text-xs sm:text-sm text-muted-foreground">
                Masukkan data curah hujan baru ke sistem.
              </p>
              <Button
                variant="contained"
                sx={{
                  mt: 2,
                  fontSize: isMobile ? "0.8rem" : "1rem",
                }}
                fullWidth
                onClick={() => (window.location.href = "/input-data")}
              >
                Mulai Input
              </Button>
            </CardContent>
          </Card>

          {/* View Data */}
          <Card className="text-center" sx={{ borderRadius: "12px" }}>
            <CardContent className="p-4 sm:p-6">
              <LayoutDashboard className="mx-auto h-8 w-8 sm:h-10 sm:w-10 text-blue-500" />
              <h2 className="mt-3 sm:mt-4 text-base sm:text-lg font-semibold">
                Lihat Data Curah Hujan
              </h2>
              <p className="text-xs sm:text-sm text-muted-foreground">
                Akses data historis curah hujan bulanan.
              </p>
              <Button
                variant="contained"
                sx={{ mt: 2, fontSize: isMobile ? "0.8rem" : "1rem" }}
                fullWidth
                onClick={() => (window.location.href = "/view-data")}
              >
                Lihat Data
              </Button>
            </CardContent>
          </Card>

          {/* View Grafik */}
          <Card className="text-center" sx={{ borderRadius: "12px" }}>
            <CardContent className="p-4 sm:p-6">
              <BarChart3 className="mx-auto h-8 w-8 sm:h-10 sm:w-10 text-blue-500" />
              <h2 className="mt-3 sm:mt-4 text-base sm:text-lg font-semibold">
                Lihat Grafik Curah Hujan
              </h2>
              <p className="text-xs sm:text-sm text-muted-foreground">
                Visualisasi tren data curah hujan.
              </p>
              <Button
                variant="contained"
                sx={{ mt: 2, fontSize: isMobile ? "0.8rem" : "1rem" }}
                fullWidth
                onClick={() => (window.location.href = "/view-grafik")}
              >
                Lihat Grafik
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Summary Section */}
        <div className="bg-muted p-4 sm:p-6 rounded-xl">
          <div
            className={`flex ${
              isMobile
                ? "flex-col gap-2 items-start"
                : "flex-row justify-between items-center mb-4"
            }`}
          >
            <h2 className="text-base sm:text-lg font-semibold">
              Ringkasan Data Terkini
            </h2>
            <span className="text-xs sm:text-sm text-muted-foreground">
              Diperbarui: {updatedAt}
            </span>
          </div>
          <div
            className={`grid gap-2 sm:gap-4 pt-2 sm:pt-4 ${
              isMobile ? "grid-cols-1" : "sm:grid-cols-3"
            }`}
          >
            <div className="border border-gray-200 pl-4 sm:pl-8 rounded-xl">
              <p className="text-xs sm:text-sm text-muted-foreground pt-2 sm:pt-4">
                Total Stasiun
              </p>
              <div className="text-lg sm:text-xl font-bold py-2 sm:py-3">
                {totalStasiun}
              </div>
            </div>
            <div className="border border-gray-200 pl-4 sm:pl-8 rounded-xl">
              <p className="text-xs sm:text-sm text-muted-foreground pt-2 sm:pt-4">
                Data Bulan Ini
              </p>
              <div className="text-lg sm:text-xl font-bold pt-2 sm:pt-3">
                {bulanIni}
              </div>
            </div>
            <div className="border border-gray-200 pl-4 sm:pl-8 rounded-xl">
              <p className="text-xs sm:text-sm text-muted-foreground pt-2 sm:pt-4">
                Curah Hujan Tertinggi
              </p>
              <div className="text-lg sm:text-xl font-bold pt-2 sm:pt-3">
                {curahMax} mm
              </div>
            </div>
          </div>
        </div>

        {/* Floating Action Button */}
        <Zoom in={true}>
          <Tooltip title="Input Data">
            <Fab
              color="primary"
              aria-label="add"
              sx={{
                position: "fixed",
                bottom: 24,
                right: 24,
                zIndex: 999,
              }}
              onClick={() => (window.location.href = "/input-data")}
            >
              <FilePlus2 size={20} />
            </Fab>
          </Tooltip>
        </Zoom>
      
      <Footer />
      </div>


    </ProtectedRoute>
  );
}
