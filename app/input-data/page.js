"use client";
import { Button, TextField, Typography, Table } from "@mui/material";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Header } from "../component/header";
import { BodyTableViewData, HeadTableViewData } from "../view-data/helper";
import { useCurahHujanAllData } from "../api/curah-hujan";
import { colors } from "../utils";

export function FormInputData({ handleSubmit, form, handleChange }) {
  return (
    <div className="bg-white p-6 rounded-xl shadow-md">
      <h2 className="text-xl font-semibold mb-2">Input Data Curah Hujan</h2>
      <p className="text-sm text-gray-600 mb-6">
        Formulir pencatatan data harian curah hujan
      </p>

      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-1 md:grid-cols-2 gap-6"
      >
        <div className="flex flex-col gap-1">
          <Typography>Hari/Tanggal</Typography>
          <TextField
            type="date"
            name="tanggal"
            className="p-2 border rounded"
            value={form.tanggal}
            onChange={handleChange}
          />
        </div>

        <div className="flex flex-col gap-1">
          <Typography>Jam</Typography>
          <TextField
            type="time"
            name="jam"
            className="p-2 border rounded"
            value={form.jam}
            onChange={handleChange}
          />
        </div>

        <div className="flex flex-col gap-1">
          <Typography>Umur HSS (Hari Setelah Semai)</Typography>
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
          <Typography>Umur Tanaman (Hari Setelah Tanam)</Typography>
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
          <Typography>Curah Hujan (mm)</Typography>
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
          <Typography>Sifat Hujan</Typography>
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
          <Typography>Varietas</Typography>
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
          <Typography>Sumber Air</Typography>
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
          <Typography>OPT (Organisme Pengganggu Tanaman)</Typography>
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
          <Typography>Keterangan (opsional)</Typography>
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
          <Button
            type="submit"
            variant="contained"
            sx={{ mt: 3 }}
            fullWidth
            className="w-full  p-2 rounded"
          >
            Submit Data
          </Button>
        </div>
      </form>
    </div>
  );
}

export default function InputData() {
  const rows = useCurahHujanAllData();
  const router = useRouter();

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
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/curah-hujan`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify(form),
        }
      );
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Gagal mengirim data: ${errorText}`);
      }
      const data = await response.json();
      console.log("Data berhasil dikirim:", data);
      alert("Data berhasil dikirim!");
      router.push("/view-data");

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

  const latestRows = Array.isArray(rows) ? rows.slice(-3).reverse() : [];

  return (
    <div className="p-6 space-y-6">
      <Header />
      <div className="min-h-screen bg-gray-100">
        <div className="max-w-7xl mx-auto p-6 space-y-10">
          <br />

          <FormInputData
            handleSubmit={handleSubmit}
            form={form}
            handleChange={handleChange}
          />

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
                  className="border rounded-xl border-white p-4 bg-blue-50 text-center flex flex-col items-center"
                >
                  <div className="flex justify-between">
                    <div
                      style={{
                        backgroundColor: colors[item.label],
                        width: 20,
                        height: 20,
                        borderRadius: "50%",
                        marginBottom: 8,
                        display: "inline-block",
                      }}
                    />
                    <div className="font-bold pl-2">{item.label}</div>
                  </div>
                  <div className="text-sm text-gray-600">{item.keterangan}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Data Terakhir */}
          <div className="bg-white p-6 rounded-xl shadow-md">
            <div className="flex justify-between mb-4">
              <h3 className="font-semibold">Data Terakhir Diinput</h3>
              <a
                href="/view-data"
                className="text-blue-600 text-sm hover:underline"
              >
                Lihat Semua
              </a>
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
