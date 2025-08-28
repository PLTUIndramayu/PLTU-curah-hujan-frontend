"use client";
import { Button, TextField, Typography, Table, useMediaQuery } from "@mui/material";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Header } from "../component/header";
import { BodyTableViewData, HeadTableViewData } from "../view-data/helper";
import { useCurahHujanAllData } from "../api/curah-hujan";
import { colors } from "../utils";

function FormInputData({ handleSubmit, form, handleChange, isMobile }) {
  return (
    <div className="bg-white p-4 sm:p-6 rounded-xl shadow-md">
      <h2 className={`font-semibold mb-2 ${isMobile ? "text-base" : "text-xl"}`}>
        Input Data Curah Hujan
      </h2>
      <p className={`mb-6 text-gray-600 ${isMobile ? "text-xs" : "text-sm"}`}>
        Formulir pencatatan data harian curah hujan
      </p>

      <form
        onSubmit={handleSubmit}
        className={`grid gap-4 sm:gap-6 ${isMobile ? "grid-cols-1" : "grid-cols-2"}`}
      >
        <div className="flex flex-col gap-1">
          <Typography variant="body2">Hari/Tanggal</Typography>
          <TextField fullWidth type="date" name="tanggal" value={form.tanggal} onChange={handleChange} />
        </div>

        <div className="flex flex-col gap-1">
          <Typography variant="body2">Jam</Typography>
          <TextField fullWidth type="time" name="jam" value={form.jam} onChange={handleChange} />
        </div>

        <div className="flex flex-col gap-1">
          <Typography variant="body2">Umur HSS</Typography>
          <TextField fullWidth type="number" name="umur_hss" value={form.umur_hss} onChange={handleChange} placeholder="Masukkan umur HSS" />
        </div>

        <div className="flex flex-col gap-1">
          <Typography variant="body2">Umur Tanaman</Typography>
          <TextField fullWidth type="number" name="umur_tanaman" value={form.umur_tanaman} onChange={handleChange} placeholder="Masukkan umur tanaman" />
        </div>

        <div className="flex flex-col gap-1">
          <Typography variant="body2">Curah Hujan (mm)</Typography>
          <TextField fullWidth type="number" name="curah_hujan" value={form.curah_hujan} onChange={handleChange} placeholder="Masukkan curah hujan" />
        </div>

        <div className="flex flex-col gap-1">
          <Typography variant="body2">Sifat Hujan</Typography>
          <TextField fullWidth type="text" name="sifat_hujan" value={form.sifat_hujan} readOnly placeholder="Terisi otomatis" />
        </div>

        <div className="flex flex-col gap-1">
          <Typography variant="body2">Varietas</Typography>
          <TextField fullWidth type="text" name="varietas" value={form.varietas} onChange={handleChange} placeholder="Masukkan varietas" />
        </div>

        <div className="flex flex-col gap-1">
          <Typography variant="body2">Sumber Air</Typography>
          <TextField fullWidth type="text" name="sumber_air" value={form.sumber_air} onChange={handleChange} placeholder="Masukkan sumber air" />
        </div>

        <div className={`${isMobile ? "col-span-1" : "col-span-2"} flex flex-col gap-1`}>
          <Typography variant="body2">OPT</Typography>
          <TextField fullWidth type="text" name="opt" value={form.opt} onChange={handleChange} placeholder="Masukkan OPT" />
        </div>

        <div className={`${isMobile ? "col-span-1" : "col-span-2"} flex flex-col gap-1`}>
          <Typography variant="body2">Keterangan</Typography>
          <TextField fullWidth name="keterangan" rows={3} multiline value={form.keterangan} onChange={handleChange} placeholder="Tambahkan keterangan" />
        </div>

        <div className={`${isMobile ? "col-span-1" : "col-span-2"}`}>
          <Button type="submit" variant="contained" fullWidth sx={{ mt: 2 }}>
            Submit Data
          </Button>
        </div>
      </form>
    </div>
  );
}

export default function InputData() {
  const isMobile = useMediaQuery("(max-width:600px)");
  const rows = useCurahHujanAllData();
  const router = useRouter();

  const [form, setForm] = useState({
    tanggal: "", jam: "", umur_hss: "", umur_tanaman: "",
    curah_hujan: "", sifat_hujan: "", varietas: "", sumber_air: "",
    opt: "", keterangan: "",
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
    if (!form.tanggal || !form.jam || !form.umur_hss || !form.umur_tanaman || !form.curah_hujan) {
      alert("Mohon lengkapi semua field yang wajib diisi.");
      return;
    }
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/curah-hujan`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(form),
      });
      if (!response.ok) throw new Error("Gagal mengirim data");
      alert("Data berhasil dikirim!");
      router.push("/view-data");
      setForm({ tanggal: "", jam: "", umur_hss: "", umur_tanaman: "", curah_hujan: "", sifat_hujan: "", varietas: "", sumber_air: "", opt: "", keterangan: "" });
    } catch (error) {
      alert("Terjadi kesalahan: " + error.message);
    }
  };

  const latestRows = Array.isArray(rows) ? rows.slice(-3).reverse() : [];

  return (
    <div className="p-4 sm:p-6 space-y-6 sm:space-y-10">
      <Header />
      <div className="min-h-screen bg-gray-100">
        <div className="max-w-full sm:max-w-7xl mx-auto p-4 sm:p-6 space-y-6 sm:space-y-10">
          <FormInputData handleSubmit={handleSubmit} form={form} handleChange={handleChange} isMobile={isMobile} />

          {/* Info Sifat Hujan */}
          <div className="bg-white p-4 sm:p-6 rounded-xl shadow-md">
            <h3 className={`font-semibold mb-4 ${isMobile ? "text-base" : "text-lg"}`}>Informasi Sifat Hujan</h3>
            <div className={`grid gap-4 ${isMobile ? "grid-cols-1" : "grid-cols-3"}`}>
              {[
                { label: "Ringan", keterangan: "0 - 5 mm/hari" },
                { label: "Sedang", keterangan: "5 - 20 mm/hari" },
                { label: "Lebat", keterangan: "> 20 mm/hari" },
              ].map((item) => (
                <div key={item.label} className="border border-blue-100 rounded-xl p-4 bg-blue-50 text-center">
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <div style={{ backgroundColor: colors[item.label], width: 16, height: 16, borderRadius: "50%" }} />
                    <span className="font-bold">{item.label}</span>
                  </div>
                  <p className="text-sm text-gray-600">{item.keterangan}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Data Terakhir */}
          <div className="bg-white p-4 sm:p-6 rounded-xl shadow-md">
            <div className="flex flex-col sm:flex-row justify-between mb-4 gap-2">
              <h3 className="font-semibold">Data Terakhir Diinput</h3>
              <a href="/view-data" className="text-blue-600 text-sm hover:underline">Lihat Semua</a>
            </div>
            <div className="overflow-x-auto">
              <Table className="min-w-full">
                <HeadTableViewData />
                <BodyTableViewData rows={latestRows} />
              </Table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
