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
      <div className="bg-white p-8 rounded shadow">
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
    <div className="bg-white p-8 rounded shadow">
      <h3 className="font-semibold mb-2">
        Rekap Bulanan - {namaBulan[bulan - 1]} {tahun}
      </h3>
      <p className="text-sm mb-2 mt-8">
        Total Curah Hujan: <strong>{totalCurah.toFixed(1)} mm</strong>
      </p>
      <p className="text-sm mb-2">
        Jumlah Hari Hujan: <strong>{jumlahHariHujan} hari</strong>
      </p>
      <p className="text-sm mb-2">
        Curah Hujan Tertinggi:{" "}
        <strong>
          {tertinggi.curah_hujan.toFixed(1)} mm (
          {new Date(tertinggi.tanggal).getDate()}{" "}
          {namaBulan[new Date(tertinggi.tanggal).getMonth()]})
        </strong>
      </p>
      <p className="text-sm">
        Curah Hujan Terendah:{" "}
        <strong>
          {terendah.curah_hujan.toFixed(1)} mm (
          {new Date(terendah.tanggal).getDate()}{" "}
          {namaBulan[new Date(terendah.tanggal).getMonth()]})
        </strong>
      </p>
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
    <ResponsiveContainer width="100%" height={300}>
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
  const currentMonth = today.getMonth() + 1;
  const currentYear = today.getFullYear();

  const selectedBulan = bulan ?? currentMonth;
  const selectedTahun = tahun ?? currentYear;

  const data = useCurahHujanByMonth(selectedBulan, selectedTahun);

  const namaBulanTerpilih = namaBulan[selectedBulan - 1];

  const rekapDasarian = [
    {
      periode: `1 - 10 ${namaBulanTerpilih} ${selectedTahun}`,
      total_curah: 0,
      hari_hujan: 0,
    },
    {
      periode: `11 - 20 ${namaBulanTerpilih} ${selectedTahun}`,
      total_curah: 0,
      hari_hujan: 0,
    },
    {
      periode: `21 - akhir ${namaBulanTerpilih} ${selectedTahun}`,
      total_curah: 0,
      hari_hujan: 0,
    },
  ];

  data.forEach((item) => {
    const tgl = new Date(item.tanggal).getDate();
    if (tgl >= 1 && tgl <= 10) {
      rekapDasarian[0].total_curah += item.curah_hujan;
      if (item.curah_hujan > 0) rekapDasarian[0].hari_hujan++;
    } else if (tgl >= 11 && tgl <= 20) {
      rekapDasarian[1].total_curah += item.curah_hujan;
      if (item.curah_hujan > 0) rekapDasarian[1].hari_hujan++;
    } else {
      rekapDasarian[2].total_curah += item.curah_hujan;
      if (item.curah_hujan > 0) rekapDasarian[2].hari_hujan++;
    }
  });

  return (
    <>
      <h3 className="font-semibold mb-2">Rekap Dasarian (10 Harian)</h3>
      <Table>
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
              <TableCell>{row.total_curah.toFixed(1)} mm</TableCell>
              <TableCell>{row.hari_hujan}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </>
  );
}

export default function ViewData() {
  const today = new Date();

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

  const [tahun, setTahun] = useState(today.getFullYear());
  const [bulan, setBulan] = useState(
    String(today.getMonth() + 1).padStart(2, "0")
  );

  const rows = useCurahHujanByMonth(bulan, tahun);

  // const handleFilter = () => {
  //   // trigger useEffect di hook karena bulan/tahun berubah
  // };

  return (
    <>
      <div className="p-6 space-y-6">
        <Header />
      </div>
      <div className="p-6 bg-gray-100 min-h-screen">
        <div className="max-w-5xl mx-auto p-1 space-y-10">
          {/* Header */}
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-xl font-bold">Data Curah Hujan</h1>
            <div className="flex gap-2">
              <div className="flex gap-2">
                <Button
                  variant="contained"
                  startIcon={<DownloadIcon />}
                  onClick={handleExport}
                  className="!bg-green-600 hover:!bg-green-600 !normal-case rounded-lg shadow-md px-6 py-2"
                >
                  Ekspor
                </Button>

                <Button
                  variant="contained"
                  startIcon={<PrintIcon />}
                  onClick={handlePrint}
                  className="!bg-blue-500 hover:!bg-blue-600 !normal-case rounded-lg shadow-md px-6 py-2 ml-5"
                >
                  Cetak
                </Button>
              </div>
            </div>
          </div>

          {/* Filter */}
          <div className="flex gap-4 mb-4">
            <select
              className="border p-2 rounded"
              value={tahun}
              onChange={(e) => setTahun(e.target.value)}
            >
              <option value="2023">2023</option>
              <option value="2024">2024</option>
              <option value="2025">2025</option>
            </select>
            <select
              className="border p-2 rounded"
              value={bulan}
              onChange={(e) => setBulan(e.target.value)}
            >
              <option value="01">Januari</option>
              <option value="02">Februari</option>
              <option value="03">Maret</option>
              <option value="04">April</option>
              <option value="05">Mei</option>
              <option value="06">Juni</option>
              <option value="07">Juli</option>
              <option value="08">Agustus</option>
              <option value="09">September</option>
              <option value="10">Oktober</option>
              <option value="11">November</option>
              <option value="12">Desember</option>
            </select>
            {/* <button
              onClick={handleFilter}
              className="bg-blue-600 text-white px-4 py-2 rounded"
            >
              Tampilkan Data
            </button> */}
          </div>

          {/* Tabel */}
          <div className="bg-white rounded shadow p-8 mb-6">
            <h2 className="font-semibold mb-2">
              Data Curah Hujan Harian - {bulan}/{tahun}
            </h2>
            <table className="w-full border-collapse">
              <HeadTableViewData />
              <BodyTableViewData rows={rows} />
            </table>
          </div>

          <div className="grid md:grid-cols-2 gap-4 mb-6">
            <div className="bg-white p-8 rounded shadow">
              <RekapDasarian data={rows} />
            </div>

            <div className="bg-white p-8 rounded shadow">
              <h3 className="font-semibold mb-2">Grafik Curah Hujan Harian</h3>
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
                  <Tooltip
                    labelFormatter={(label) =>
                      new Date(label).toLocaleDateString("id-ID")
                    }
                  />
                  <Bar dataKey="curah_hujan" fill="#60A5FA" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <RekapBulanan />

            <div className="bg-white p-8 rounded shadow">
              <h3 className="font-semibold mb-2">Statistik</h3>
              <RekapSifatHujan data={rows} />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
