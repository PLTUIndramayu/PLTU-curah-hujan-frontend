"use client";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import { useState, useMemo } from "react";
import DownloadIcon from "@mui/icons-material/Download";
import PrintIcon from "@mui/icons-material/Print";

import {
  Box,
  Typography,
  Card,
  CardContent,
  FormControl,
  Select,
  MenuItem,
  Button,
  ToggleButtonGroup,
  ToggleButton,
} from "@mui/material";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import dayjs from "dayjs";
import { useCurahHujanAllData } from "../api/curah-hujan";
import { Header } from "../component/header";
import { colors } from "../utils";

export default function ViewGrafik() {
  return (
    <>
      <div className="p-6 space-y-6">
        <Header />
      </div>
      <ViewGrafikTahunan />
      <ViewChart />
    </>
  );
}

function ViewGrafikTahunan() {
  const rows = useCurahHujanAllData();
  const [periode, setPeriode] = useState("Bulanan");
  const [bulan, setBulan] = useState(dayjs().format("MM"));
  const [tahun, setTahun] = useState(dayjs().format("YYYY"));

  // === Filter Data Sesuai Periode ===
  const filteredData = useMemo(() => {
    if (!rows.length) return [];

    if (periode === "Bulanan") {
      return rows.filter((item) => {
        const tgl = dayjs(item.tanggal);
        return tgl.format("MM") === bulan && tgl.format("YYYY") === tahun;
      });
    }

    if (periode === "Dasarian") {
      return rows
        .filter((item) => {
          const tgl = dayjs(item.tanggal);
          return tgl.format("MM") === bulan && tgl.format("YYYY") === tahun;
        })
        .map((item) => {
          const day = dayjs(item.tanggal).date();
          let dasarian = "I";
          if (day > 10 && day <= 20) dasarian = "II";
          if (day > 20) dasarian = "III";
          return { ...item, dasarian };
        });
    }

    if (periode === "Tahunan") {
      return rows.filter((item) => {
        return dayjs(item.tanggal).format("YYYY") === tahun;
      });
    }

    return rows;
  }, [rows, periode, bulan, tahun]);

  // === Olah data untuk grafik ===
  const lineData = useMemo(() => {
    if (periode === "Bulanan") {
      return filteredData.map((item) => ({
        name: dayjs(item.tanggal).format("DD"),
        curah_hujan: item.curah_hujan, // Sesuaikan nama field
      }));
    }
    if (periode === "Dasarian") {
      const grouped = {};
      filteredData.forEach((item) => {
        const key = `Dasarian ${item.dasarian}`;
        grouped[key] = (grouped[key] || 0) + item.curah_hujan;
      });
      return Object.entries(grouped).map(([name, val]) => ({
        name,
        curah_hujan: val,
      }));
    }
    if (periode === "Tahunan") {
      const grouped = {};
      filteredData.forEach((item) => {
        const key = dayjs(item.tanggal).format("MMM");
        grouped[key] = (grouped[key] || 0) + item.curah_hujan;
      });
      return Object.entries(grouped).map(([name, val]) => ({
        name,
        curah_hujan: val,
      }));
    }
    return [];
  }, [filteredData, periode]);

  // === Statistik sederhana ===
  const totalCurah = lineData.reduce((sum, d) => sum + d.curah_hujan, 0);
  const tertinggi = Math.max(...lineData.map((d) => d.curah_hujan), 0);
  const terendah = Math.min(...lineData.map((d) => d.curah_hujan), 0);

  const handleExport = () => {
    if (!rows || rows.length === 0) return;

    const worksheet = XLSX.utils.json_to_sheet(rows);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Curah Hujan");

    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });
    const data = new Blob([excelBuffer], { type: "application/octet-stream" });
    saveAs(data, `curah-hujan-${bulan}-${tahun}.xlsx`);
  };

  const handlePrint = () => {
    window.print();
  };
  return (
    <Box p={5}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Box>
          <Typography variant="h5" fontWeight="bold">
            Grafik Curah Hujan
          </Typography>
          <Typography variant="body2" color="text.secondary" mb={2}>
            Visualisasi tren curah hujan berdasarkan periode
          </Typography>
        </Box>

        <Box sx={{ display: "flex", gap: 2 }}>
          <Button
            variant="contained"
            startIcon={<DownloadIcon />}
            onClick={handleExport}
            className="!bg-green-600 hover:!bg-green-600 !normal-case rounded-lg shadow-md px-6 py-2"
            sx={{
              textTransform: "none",
              borderRadius: 2,
              boxShadow: 2,
              px: 3,
              py: 1,
            }}
          >
            Ekspor
          </Button>

          <Button
            variant="contained"
            startIcon={<PrintIcon />}
            onClick={handlePrint}
            className="!bg-blue-500 hover:!bg-blue-600 !normal-case rounded-lg shadow-md px-6 py-2 ml-5"
            sx={{
              textTransform: "none",
              borderRadius: 2,
              boxShadow: 2,
              px: 3,
              py: 1,
            }}
          >
            Cetak
          </Button>
        </Box>
      </Box>

      {/* Grafik */}
      <Card sx={{ mb: 2 }}>
        <CardContent>
          <ToggleButtonGroup
            value={periode}
            exclusive
            onChange={(e, val) => val && setPeriode(val)}
            sx={{ mb: 2 }}
          >
            <ToggleButton value="Bulanan">Bulanan</ToggleButton>
            <ToggleButton value="Dasarian">Dasarian</ToggleButton>
            <ToggleButton value="Tahunan">Tahunan</ToggleButton>
          </ToggleButtonGroup>

          {/* Filter */}
          <Box display="flex" gap={2} mb={2} mt={2}>
            <FormControl size="small" sx={{ minWidth: 120 }}>
              <Select value={tahun} onChange={(e) => setTahun(e.target.value)}>
                {[2025].map((y) => (
                  <MenuItem key={y} value={String(y)}>
                    {y}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            {periode !== "Tahunan" && (
              <FormControl size="small" sx={{ minWidth: 120 }}>
                <Select
                  value={bulan}
                  onChange={(e) => setBulan(e.target.value)}
                >
                  {Array.from({ length: 12 }, (_, i) => (
                    <MenuItem
                      key={i + 1}
                      value={String(i + 1).padStart(2, "0")}
                    >
                      {dayjs(`2025-${i + 1}-01`).format("MMMM")}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            )}
          </Box>
          <br />
          {/* Grafik Line */}
          <LineChart width={1250} height={300} data={lineData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="curah_hujan" stroke="#1976d2" />
          </LineChart>

          {/* Statistik */}
          <Typography variant="body2" mt={2}>
            Total Curah Hujan: <strong>{totalCurah.toFixed(1)} mm</strong>
          </Typography>
          <Typography variant="body2">
            Tertinggi: <strong>{tertinggi.toFixed(1)} mm</strong>
          </Typography>
          <Typography variant="body2">
            Terendah: <strong>{terendah.toFixed(1)} mm</strong>
          </Typography>
        </CardContent>
      </Card>
    </Box>
  );
}

function ViewChart() {
  const [periode, setPeriode] = useState("Bulanan");
  const rows = useCurahHujanAllData();

  const lineData = useMemo(() => {
    const grouped = {};
    rows.forEach((item) => {
      const bulan = new Date(item.tanggal).toLocaleString("id-ID", {
        month: "short",
      });
      grouped[bulan] =
        (grouped[bulan] || 0) + (parseFloat(item.curah_hujan) || 0);
    });

    return Object.keys(grouped).map((bulan) => ({
      name: bulan,
      curah_hujan: grouped[bulan],
      normal: 150,
    }));
  }, [rows]);

  const pieData = Object.values(
    rows.reduce((acc, cur) => {
      if (!acc[cur.sifat_hujan]) {
        acc[cur.sifat_hujan] = {
          name: cur.sifat_hujan,
          value: 0,
          color: colors[cur.sifat_hujan] || "#A78BFA",
        };
      }
      acc[cur.sifat_hujan].value += 1;
      return acc;
    }, {})
  );

  return (
    <Box pl={5} pr={5} pb={5}>
      {/* Statistik */}
      <Box display="flex" gap={2} flexWrap="wrap">
        <Card sx={{ flex: 1 }}>
          <CardContent sx={{ justifyItems: "center" }}>
            <Typography variant="subtitle1" fontWeight="bold">
              Statistik Bulanan
            </Typography>
            <br />
            <br />
            <BarChart width={300} height={200} data={lineData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="curah_hujan" fill="#1976d2" />
            </BarChart>
            <Typography variant="body2">
              Rata-rata:{" "}
              {lineData.length
                ? (
                    lineData.reduce((a, b) => a + b.curah_hujan, 0) /
                    lineData.length
                  ).toFixed(1)
                : 0}{" "}
              mm
            </Typography>
            <Typography variant="body2">
              Tertinggi:{" "}
              {lineData.length
                ? Math.max(...lineData.map((d) => d.curah_hujan))
                : 0}{" "}
              mm
            </Typography>
          </CardContent>
        </Card>

        <Card sx={{ flex: 1 }}>
          <CardContent sx={{ justifyItems: "center" }}>
            <Typography variant="subtitle1" fontWeight="bold">
              Distribusi Curah Hujan
            </Typography>

            {pieData.length > 0 ? (
              <PieChart width={300} height={300}>
                <Pie
                  dataKey="value"
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  label={(entry) =>
                    `${entry.name || "Tidak ada"}: ${entry.value}`
                  }
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>

                <Tooltip />
                <Legend />
              </PieChart>
            ) : (
              <Typography variant="body2" color="text.secondary">
                Tidak ada data untuk ditampilkan
              </Typography>
            )}
          </CardContent>
        </Card>
      </Box>
    </Box>
  );
}
