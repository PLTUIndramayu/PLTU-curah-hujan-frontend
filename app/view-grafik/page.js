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
  useMediaQuery,
  useTheme,
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
  ResponsiveContainer,
} from "recharts";
import dayjs from "dayjs";
import "dayjs/locale/id";
dayjs.locale("id");

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
  const isMobile = useMediaQuery("(max-width:600px)");

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

  const lineData = useMemo(() => {
    if (periode === "Bulanan") {
      return filteredData.map((item) => ({
        name: dayjs(item.tanggal).format("DD"),
        curah_hujan: item.curah_hujan,
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
    <Box p={isMobile ? 2 : 5}>
      <Box
        sx={{
          display: "flex",
          flexDirection: isMobile ? "column" : "row",
          justifyContent: "space-between",
          alignItems: isMobile ? "flex-start" : "center",
          gap: isMobile ? 2 : 0,
        }}
      >
        <Box>
          <Typography variant={isMobile ? "h6" : "h5"} fontWeight="bold">
            Grafik Curah Hujan
          </Typography>
          <Typography variant="body2" color="text.secondary" mb={2}>
            Visualisasi tren curah hujan berdasarkan periode
          </Typography>
        </Box>

        <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
          <Button
            variant="contained"
            startIcon={<DownloadIcon />}
            onClick={handleExport}
            className="!bg-green-600 hover:!bg-green-600 !normal-case rounded-lg shadow-md"
            sx={{
              textTransform: "none",
              borderRadius: 2,
              boxShadow: 2,
              px: isMobile ? 2 : 3,
              py: 1,
              fontSize: isMobile ? "0.75rem" : "0.9rem",
            }}
          >
            Ekspor
          </Button>

          <Button
            variant="contained"
            startIcon={<PrintIcon />}
            onClick={handlePrint}
            className="!bg-blue-500 hover:!bg-blue-600 !normal-case rounded-lg shadow-md"
            sx={{
              textTransform: "none",
              borderRadius: 2,
              boxShadow: 2,
              px: isMobile ? 2 : 3,
              py: 1,
              fontSize: isMobile ? "0.75rem" : "0.9rem",
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
            sx={{ mb: 2, flexWrap: "wrap" }}
            size={isMobile ? "small" : "medium"}
          >
            <ToggleButton value="Bulanan">Bulanan</ToggleButton>
            <ToggleButton value="Dasarian">Dasarian</ToggleButton>
            <ToggleButton value="Tahunan">Tahunan</ToggleButton>
          </ToggleButtonGroup>

          {/* Filter */}
          <Box display="flex" gap={2} mb={2} mt={2} flexWrap="wrap">
            {/* Dropdown Tahun */}
            <FormControl size="small" sx={{ minWidth: isMobile ? 100 : 120 }}>
              <Select value={tahun} onChange={(e) => setTahun(e.target.value)}>
                {Array.from({ length: 3 }, (_, i) => dayjs().year() + i).map(
                  (y) => (
                    <MenuItem key={y} value={String(y)}>
                      {y}
                    </MenuItem>
                  )
                )}
              </Select>
            </FormControl>

            {/* Dropdown Bulan */}
            {periode !== "Tahunan" && (
              <FormControl size="small" sx={{ minWidth: isMobile ? 100 : 120 }}>
                <Select
                  value={bulan}
                  onChange={(e) => setBulan(e.target.value)}
                >
                  {Array.from({ length: 12 }, (_, i) => (
                    <MenuItem
                      key={i + 1}
                      value={String(i + 1).padStart(2, "0")}
                    >
                      {dayjs(`${tahun}-${i + 1}-01`).format("MMMM")}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            )}
          </Box>

          {/* Grafik Line Responsive */}
          <Box sx={{ width: "100%", height: isMobile ? 250 : 300 }}>
            <ResponsiveContainer>
              <LineChart data={lineData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                {!isMobile && <Legend />}
                <Line type="monotone" dataKey="curah_hujan" stroke="#1976d2" />
              </LineChart>
            </ResponsiveContainer>
          </Box>

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
  const rows = useCurahHujanAllData();

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

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
    <Box pl={isMobile ? 2 : 5} pr={isMobile ? 2 : 5} pb={5}>
      <Box display="flex" gap={2} flexDirection={isMobile ? "column" : "row"}>
        {/* Statistik Bulanan */}
        <Card sx={{ flex: 1 }}>
          <CardContent>
            <Typography variant="subtitle1" fontWeight="bold">
              Statistik Bulanan
            </Typography>
            <Box sx={{ width: "100%", height: isMobile ? 200 : 250 }}>
              <ResponsiveContainer>
                <BarChart data={lineData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="curah_hujan" fill="#1976d2" />
                </BarChart>
              </ResponsiveContainer>
            </Box>

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

        {/* Distribusi Curah Hujan */}
        <Card sx={{ flex: 1 }}>
          <CardContent>
            <Typography variant="subtitle1" fontWeight="bold">
              Distribusi Curah Hujan
            </Typography>

            {pieData.length > 0 ? (
              <Box sx={{ width: "100%", height: isMobile ? 220 : 300 }}>
                <ResponsiveContainer>
                  <PieChart>
                    <Pie
                      dataKey="value"
                      data={pieData}
                      cx="50%"
                      cy="50%"
                      outerRadius={isMobile ? "70%" : "80%"}
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
                </ResponsiveContainer>
              </Box>
            ) : (
              <Typography variant="body2" color="text.secondary">
                Data tidak tersedia
              </Typography>
            )}
          </CardContent>
        </Card>
      </Box>
    </Box>
  );
}
