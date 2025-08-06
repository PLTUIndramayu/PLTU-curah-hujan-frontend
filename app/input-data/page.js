"use client";
import { TextField, Typography } from "@mui/material";
import React, { useState } from "react";
import { TableBody, TableCell, TableHead, TableRow } from "@mui/material";
import { Header } from "../component/header";

export default function InputDatacurah_hujan() {
  const [form, setForm] = useState({
    tanggal: "",
    jam: "",
    umur_hss: "",
    umur_tanaman: "",
    curah_hujan: "",
    sifat_hujan: "",
    varietas: "",
    sumber_air: "",
    opt: "",
    keterangan: "",
  });

  const hitungsifat_hujan = (mm) => {
    if (mm <= 5) return "Ringan";
    if (mm <= 20) return "Sedang";
    return "Lebat";
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    let updatedForm = { ...form, [name]: value };

    if (name === "curah_hujan") {
      updatedForm.sifat_hujan = hitungsifat_hujan(parseFloat(value));
    }

    setForm(updatedForm);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (
      !form.tanggal ||
      !form.jam ||
      !form.umur_hss ||
      !form.umur_tanaman ||
      !form.curah_hujan
    ) {
      alert("Mohon lengkapi semua field yang wajib diisi.");
      return;
    }
    try {
      const response = await fetch("http://localhost:3001/curah-hujan", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(form),
      });
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Gagal mengirim data: ${errorText}`);
      }
      const data = await response.json();
      console.log("Data berhasil dikirim:", data);

      setForm({
        tanggal: "",
        jam: "",
        umur_hss: "",
        umur_tanaman: "",
        curah_hujan: "",
        sifat_hujan: "",
        varietas: "",
        sumber_air: "",
        opt: "",
        keterangan: "",
      });
    } catch (error) {
      console.error("Terjadi kesalahan:", error);
      alert("Terjadi kesalahan saat mengirim data: " + error.message);
    }
    console.log(form);
  };

  return (
    <div className="p-6 space-y-6">
      <Header />
      <div className="min-h-screen bg-gray-100">
        <div className="max-w-4xl mx-auto p-6 space-y-10">
          <br />
          <div className="bg-white p-6 rounded-xl shadow-md">
            <h2 className="text-xl font-semibold mb-2">
              Input Data Curah Hujan
            </h2>
            <p className="text-sm text-gray-600 mb-6">
              Formulir pencatatan data harian curah hujan
            </p>

            <form
              onSubmit={handleSubmit}
              className="grid grid-cols-1 md:grid-cols-2 gap-6"
            >
              <div className="flex flex-col gap-1">
                <label className="font-medium text-gray-700">
                  Hari/Tanggal
                </label>
                <TextField
                  type="date"
                  name="tanggal"
                  className="p-2 border rounded"
                  value={form.tanggal}
                  onChange={handleChange}
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="font-medium text-gray-700">Jam</label>
                <TextField
                  type="time"
                  name="jam"
                  className="p-2 border rounded"
                  value={form.jam}
                  onChange={handleChange}
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="font-medium text-gray-700">
                  Umur HSS (Hari Setelah Semai)
                </label>
                <TextField
                  type="number"
                  name="umur_hss"
                  className="p-2 border rounded"
                  value={form.umur_hss}
                  onChange={handleChange}
                  placeholder="Masukkan umur HSS"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="font-medium text-gray-700">
                  Umur Tanaman (Hari Setelah Tanam)
                </label>
                <TextField
                  type="number"
                  name="umur_tanaman"
                  className="p-2 border rounded"
                  value={form.umur_tanaman}
                  onChange={handleChange}
                  placeholder="Masukkan umur tanaman"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="font-medium text-gray-700">
                  Curah Hujan (mm)
                </label>
                <TextField
                  type="number"
                  name="curah_hujan"
                  className="p-2 border rounded"
                  value={form.curah_hujan}
                  onChange={handleChange}
                  placeholder="Masukkan curah hujan"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="font-medium text-gray-700">Sifat Hujan</label>
                <TextField
                  type="text"
                  name="sifat_hujan"
                  className="p-2 border rounded bg-gray-100"
                  value={form.sifat_hujan}
                  readOnly
                  placeholder="Terisi otomatis"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="font-medium text-gray-700">Varietas</label>
                <TextField
                  type="text"
                  name="varietas"
                  className="p-2 border rounded"
                  value={form.varietas}
                  onChange={handleChange}
                  placeholder="Masukkan varietas"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="font-medium text-gray-700">Sumber Air</label>
                <TextField
                  type="text"
                  name="sumber_air"
                  className="p-2 border rounded"
                  value={form.sumber_air}
                  onChange={handleChange}
                  placeholder="Masukkan sumber air"
                />
              </div>

              <div className="md:col-span-2 flex flex-col gap-1">
                <label className="font-medium text-gray-700">
                  OPT (Organisme Pengganggu Tanaman)
                </label>
                <TextField
                  type="text"
                  name="opt"
                  className="p-2 border rounded"
                  value={form.opt}
                  onChange={handleChange}
                  placeholder="Masukkan OPT"
                />
              </div>

              <div className="md:col-span-2 flex flex-col gap-1">
                <label className="font-medium text-gray-700">
                  Keterangan (opsional)
                </label>
                <TextField
                  name="keterangan"
                  className="p-2 border rounded"
                  rows="3"
                  multiline
                  value={form.keterangan}
                  onChange={handleChange}
                  placeholder="Tambahkan keterangan jika diperlukan"
                ></TextField>
              </div>

              <div className="md:col-span-2">
                <button
                  type="submit"
                  className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700"
                >
                  Submit Data
                </button>
              </div>
            </form>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-md">
            <h3 className="font-semibold mb-4">Informasi Sifat Hujan</h3>
            <div className="grid grid-cols-3 gap-4">
              {[
                { label: "Ringan", keterangan: "Curah hujan: 0 - 5 mm/hari" },
                { label: "Sedang", keterangan: "Curah hujan: 5 - 20 mm/hari" },
                { label: "Lebat", keterangan: "Curah hujan: > 20 mm/hari" },
              ].map((item) => (
                <div
                  key={item.label}
                  className="border rounded-xl border-white p-4 bg-blue-50 text-center"
                >
                  <div className="font-bold">{item.label}</div>
                  <div className="text-sm text-gray-600">{item.keterangan}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Data Terakhir */}
          <div className="bg-white p-6 rounded-xl shadow-md">
            <div className="flex justify-between mb-4">
              <h3 className="font-semibold">Data Terakhir Diinput</h3>
              <a href="#" className="text-blue-600 text-sm hover:underline">
                Lihat Semua
              </a>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <Head />
                <Body />
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Head() {
  return (
    <TableHead>
      <TableRow>
        <TableCell>Tanggal</TableCell>
        <TableCell>Jam</TableCell>
        <TableCell>Umur HSS</TableCell>
        <TableCell>Umur Tanaman</TableCell>
        <TableCell>Curah Hujan</TableCell>
        <TableCell>Sifat Hujan</TableCell>
      </TableRow>
    </TableHead>
  );
}

function Body() {
  const [rows, setRows] = useState([]);
  const fetchData = async () => {
    try {
      const response = await fetch("http://localhost:3001/curah-hujan", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Gagal mengambil data: ${errorText}`);
      }
      const json = await response.json();
      const data = json.data;
      setRows(data);
    } catch (error) {
      console.error("Terjadi kesalahan saat mengambil data:", error);
      alert("Terjadi kesalahan saat mengambil data: " + error.message);
    }
  };

  React.useEffect(() => {
    fetchData();
  }, []);

  return (
    <TableBody>
      {Array.isArray(rows) && rows.length > 0 ? (
        rows.map((item, index) => (
          <TableRow key={index}>
            <TableCell>
              {item.tanggal
                ? new Date(item.tanggal).toLocaleDateString("id-ID", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })
                : ""}
            </TableCell>
            <TableCell>
              {item.jam
                ? new Date(`1970-01-01T${item.jam}`).toLocaleTimeString("id-ID", {
                    hour: "2-digit",
                    minute: "2-digit",
                  })
                : ""}
            </TableCell>
            <TableCell>{item.umur_hss}</TableCell>
            <TableCell>{item.umur_tanaman}</TableCell>
            <TableCell>{item.curah_hujan}</TableCell>
            <TableCell>{item.sifat_hujan}</TableCell>
          </TableRow>
        ))
      ) : (
        <TableRow>
          <TableCell colSpan={6} align="center">
            Tidak ada data
          </TableCell>
        </TableRow>
      )}
    </TableBody>
  );
}
