"use client";
import { Header } from "../component/header";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import DownloadIcon from "@mui/icons-material/Download";
import PrintIcon from "@mui/icons-material/Print";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  Legend,
  ResponsiveContainer,
} from "recharts";
import {
  Button,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  FormControl,
  Select,
  MenuItem,
  Grid,
  useMediaQuery,
  Box,
} from "@mui/material";
import { BodyTableViewData, HeadTableViewData } from "./helper";
import { useCurahHujanByMonth } from "../api/curah-hujan";
import { useState } from "react";
import { colors, namaBulan } from "../utils";

function RekapBulanan() {
  const today = new Date();
  const bulan = today.getMonth() + 1;
  const tahun = today.getFullYear();
  const data = useCurahHujanByMonth(bulan, tahun);

  if (!data || data.length === 0) {
    return (
      <div className="bg-white p-4 sm:p-8 rounded shadow">
        <h3 className="font-semibold mb-2">
          Rekap Bulanan - {bulan}/{tahun}
        </h3>
        <p className="text-sm text-gray-500">Data tidak tersedia.</p>
      </div>
    );
  }

  const totalCurah = data.reduce(
    (sum, item) => sum + (item.curah_hujan || 0),
    0
  );
  const jumlahHariHujan = data.filter((item) => item.curah_hujan > 0).length;
  const tertinggi = data.reduce((max, item) =>
    item.curah_hujan > max.curah_hujan ? item : max
  );
  const terendah = data
    .filter((item) => item.curah_hujan > 0)
    .reduce((min, item) => (item.curah_hujan < min.curah_hujan ? item : min));

  return (
    <div className="bg-white p-4 sm:p-8 rounded-xl shadow">
      <h3 className="font-semibold mb-2">
        Rekap Bulanan - {namaBulan[bulan - 1]} {tahun}
      </h3>
      <div className="text-sm space-y-2 mt-4">
        <p>
          Total Curah Hujan: <strong>{totalCurah.toFixed(1)} mm</strong>
        </p>
        <p>
          Jumlah Hari Hujan: <strong>{jumlahHariHujan} hari</strong>
        </p>
        <p>
          Curah Hujan Tertinggi:{" "}
          <strong>
            {tertinggi.curah_hujan.toFixed(1)} mm (
            {new Date(tertinggi.tanggal).getDate()}{" "}
            {namaBulan[new Date(tertinggi.tanggal).getMonth()]})
          </strong>
        </p>
        <p>
          Curah Hujan Terendah:{" "}
          <strong>
            {terendah.curah_hujan.toFixed(1)} mm (
            {new Date(terendah.tanggal).getDate()}{" "}
            {namaBulan[new Date(terendah.tanggal).getMonth()]})
          </strong>
        </p>
      </div>
    </div>
  );
}

function RekapSifatHujan({ data }) {
  const pieData = Object.values(
    data.reduce((acc, cur) => {
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
    <ResponsiveContainer width="100%" height={250}>
      <PieChart>
        <Pie
          dataKey="value"
          data={pieData}
          cx="50%"
          cy="50%"
          outerRadius={80}
          label
        >
          {pieData.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={entry.color} />
          ))}
        </Pie>
        <Tooltip />
        <Legend />
      </PieChart>
    </ResponsiveContainer>
  );
}

function RekapDasarian({ bulan, tahun }) {
  const today = new Date();
  const selectedBulan = bulan ?? today.getMonth() + 1;
  const selectedTahun = tahun ?? today.getFullYear();
  const data = useCurahHujanByMonth(selectedBulan, selectedTahun);
  const namaBulanTerpilih = namaBulan[selectedBulan - 1];

  const rekapDasarian = [
    { periode: `1 - 10 ${namaBulanTerpilih}`, total_curah: 0, hari_hujan: 0 },
    { periode: `11 - 20 ${namaBulanTerpilih}`, total_curah: 0, hari_hujan: 0 },
    {
      periode: `21 - akhir ${namaBulanTerpilih}`,
      total_curah: 0,
      hari_hujan: 0,
    },
  ];

  data.forEach((item) => {
    const tgl = new Date(item.tanggal).getDate();
    if (tgl <= 10) {
      rekapDasarian[0].total_curah += item.curah_hujan;
      if (item.curah_hujan > 0) rekapDasarian[0].hari_hujan++;
    } else if (tgl <= 20) {
      rekapDasarian[1].total_curah += item.curah_hujan;
      if (item.curah_hujan > 0) rekapDasarian[1].hari_hujan++;
    } else {
      rekapDasarian[2].total_curah += item.curah_hujan;
      if (item.curah_hujan > 0) rekapDasarian[2].hari_hujan++;
    }
  });

  return (
    <div className="overflow-x-auto">
      <h3 className="font-semibold mb-2">Rekap Dasarian</h3>
      <Table size="medium">
        <TableHead>
          <TableRow>
            <TableCell>Periode</TableCell>
            <TableCell>Total Curah Hujan (mm)</TableCell>
            <TableCell>Hari Hujan</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rekapDasarian.map((row, idx) => (
            <TableRow key={idx}>
              <TableCell>{row.periode}</TableCell>
              <TableCell>{row.total_curah.toFixed(1)}</TableCell>
              <TableCell>{row.hari_hujan}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

export default function ViewData() {
  const today = new Date();
  const isMobile = useMediaQuery("(max-width:600px)");

  const [tahun, setTahun] = useState(today.getFullYear());
  const [bulan, setBulan] = useState(
    String(today.getMonth() + 1).padStart(2, "0")
  );
  const rows = useCurahHujanByMonth(bulan, tahun);

  const handleExport = () => {
    if (!rows || rows.length === 0) return;
    const worksheet = XLSX.utils.json_to_sheet(rows);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Curah Hujan");
    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });
    saveAs(new Blob([excelBuffer]), `curah-hujan-${bulan}-${tahun}.xlsx`);
  };

  const handlePrint = () => window.print();

  return (
    <>
      <div className="p-4 sm:p-6">
        <Header />
      </div>
      <div className="p-4 sm:p-6 bg-gray-100 min-h-screen">
        <div className="max-w-7xl mx-auto space-y-8">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">
            <h1 className="text-lg sm:text-xl font-bold">
              Data Curah Hujan Bulanan
            </h1>
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
          </div>

          {/* Filter */}
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth size="small">
                <Select
                  value={tahun}
                  onChange={(e) => setTahun(e.target.value)}
                >
                  <MenuItem value="2023">2023</MenuItem>
                  <MenuItem value="2024">2024</MenuItem>
                  <MenuItem value="2025">2025</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth size="small">
                <Select
                  value={bulan}
                  onChange={(e) => setBulan(e.target.value)}
                >
                  {namaBulan.map((b, i) => (
                    <MenuItem key={i} value={String(i + 1).padStart(2, "0")}>
                      {b}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
          </Grid>

          {/* Tabel */}
          <div className="bg-white rounded shadow p-4 sm:p-6 overflow-x-auto">
            <h2 className="font-semibold mb-2">
              Data Harian - {namaBulan[bulan - 1]} {tahun}
            </h2>
            <Table className="min-w-[600px]">
              <HeadTableViewData />
              <BodyTableViewData rows={rows} />
            </Table>
          </div>

          {/* Grafik & Dasarian */}
          <div
            className={`grid ${
              isMobile ? "grid-cols-1" : "md:grid-cols-2"
            } gap-4`}
          >
            <div className="bg-white p-4 sm:p-6 rounded-xl shadow-md">
              <RekapDasarian bulan={bulan} tahun={tahun} />
            </div>
            <div className="bg-white p-4 sm:p-6 rounded-xl shadow-md">
              <h3 className="font-semibold mb-2">Grafik Harian</h3>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={rows}>
                  <XAxis
                    dataKey="tanggal"
                    tickFormatter={(date) =>
                      new Date(date).toLocaleDateString("id-ID", {
                        day: "2-digit",
                        month: "short",
                      })
                    }
                  />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="curah_hujan" fill="#1976d2" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Statistik */}
          <div
            className={`grid ${
              isMobile ? "grid-cols-1" : "md:grid-cols-2"
            } gap-4`}
          >
            <RekapBulanan />
            <div className="bg-white p-4 sm:p-6 rounded-xl shadow-md">
              <h3 className="font-semibold mb-2">Statistik Sifat Hujan</h3>
              <RekapSifatHujan data={rows} />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
