"use client";

import { useState } from "react";
import {
  Box,
  Button,
  TextField,
  Typography,
  Avatar,
  Grid,
  Paper,
  Divider,
} from "@mui/material";
import { useRouter } from "next/navigation";

export default function ProfilePage() {
  const router = useRouter();
  const [form, setForm] = useState({
    kode: "USR-123",
    jabatan: "Operator Stasiun",
    email: "john@gmail.com",
    nomor_telepon: "081234567890",
    nama: "John",
    tanggal_lahir: "1988-03-15",
    alamat:
      "Jl. Kebon Jeruk No. 15, RT 05/RW 07, Kelurahan Kebon Jeruk, Kecamatan Kebon Jeruk, Jakarta Barat, DKI Jakarta 11530",
    kode_stasiun: "GMR",
    tgl_mulai_bekerja: "2018-06-01",
    departemen: "Operasional",
    supervisor: "Budi Santoso",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (
      !form.nama ||
      !form.email ||
      !form.jabatan ||
      !form.alamat ||
      !form.kode_stasiun
    ) {
      alert("Mohon lengkapi semua field yang wajib diisi.");
      return;
    }
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/auth/update-profile`,
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

      setForm({
        kode: "",
        jabatan: "",
        email: "",
        nomor_telepon: "",
        nama: "",
        tanggal_lahir: "",
        alamat: "",
        kode_stasiun: "",
        tgl_mulai_bekerja: "",
        departemen: "",
        supervisor: "",
      });
    } catch (error) {
      console.error("Terjadi kesalahan:", error);
      alert("Terjadi kesalahan saat mengirim data: " + error.message);
    }
    console.log(form);
  };

  return (
    <Box sx={{ p: 4 }}>
      <Paper elevation={3} sx={{ p: 3, borderRadius: 3 }}>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography variant="h6" fontWeight="bold">
            Profil Pengguna
          </Typography>
          <div className="flex justify-end">
            <Button
              variant="contained"
              color="error"
              onClick={() => {
                router.push("/dashboard");
              }}
            >
              Batal
            </Button>
            &nbsp; &nbsp;
            <Button variant="contained" onClick={handleSubmit}>
              Simpan Perubahan
            </Button>
          </div>
        </Box>

        <Divider sx={{ my: 2 }} />

        {/* Foto + Info User */}
        <Box p={3}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex flex-col gap-1">
              <Avatar
                //   src="/user.jpg"
                sx={{ width: 100, height: 100 }}
              />
            </div>
            <div className="flex flex-col gap-1"></div>
            <div className="flex flex-col gap-1">
              <Typography variant="subtitle1" fontWeight="bold">
                ID Pegawai
              </Typography>
              <TextField
                name="id"
                fullWidth
                value={form.kode}
                onChange={handleChange}
              />
            </div>

            <div className="flex flex-col gap-1">
              <Typography variant="subtitle1" fontWeight="bold">
                Jabatan*
              </Typography>
              <TextField
                name="jabatan"
                fullWidth
                value={form.jabatan}
                onChange={handleChange}
              />
            </div>

            <div className="flex flex-col gap-1">
              <Typography variant="subtitle1" fontWeight="bold">
                Email*
              </Typography>
              <TextField
                name="email"
                fullWidth
                value={form.email}
                onChange={handleChange}
              />
            </div>
            <div className="flex flex-col gap-1">
              <Typography variant="subtitle1" fontWeight="bold">
                Nomor Telepon*
              </Typography>
              <TextField
                name="nomor_telepon"
                fullWidth
                value={form.nomor_telepon}
                onChange={handleChange}
              />
            </div>
          </div>
        </Box>
        {/* Informasi Pribadi */}

        <Box p={3}>
          <Typography variant="subtitle1" fontWeight="bold">
            Informasi Pribadi
          </Typography>
          <Divider sx={{ my: 1 }} />

          <Grid container spacing={2} mt={1}>
            <Grid size={6} item xs={12} md={6}>
              <Typography variant="subtitle1" fontWeight="bold">
                Nama*
              </Typography>
              <TextField
                name="nama"
                fullWidth
                value={form.nama}
                onChange={handleChange}
              />
            </Grid>
            <Grid size={6} item xs={12} md={6}>
              <Typography variant="subtitle1" fontWeight="bold">
                Tanggal Lahir
              </Typography>
              <TextField
                type="date"
                name="tanggal_lahir"
                fullWidth
                value={form.tanggal_lahir}
                onChange={handleChange}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
          </Grid>
          <Typography variant="subtitle1" fontWeight="bold">
            Alamat*
          </Typography>
          <TextField
            name="alamat"
            fullWidth
            multiline
            rows={2}
            value={form.alamat}
            onChange={handleChange}
          />
        </Box>

        {/* Informasi Pekerjaan */}

        <Box p={3}>
          <Typography variant="subtitle1" fontWeight="bold">
            Informasi Pekerjaan
          </Typography>
          <Divider sx={{ my: 1 }} />

          <Grid container spacing={2} mt={1}>
            <Grid size={6} item xs={12} md={6}>
              <Typography variant="subtitle1" fontWeight="bold">
                Kode Stasiun*
              </Typography>
              <TextField
                name="kode_stasiun"
                fullWidth
                value={form.kode_stasiun}
                onChange={handleChange}
              />
            </Grid>

            <Grid size={6} item xs={12} md={6}>
              <Typography variant="subtitle1" fontWeight="bold">
                Tanggal Mulai Bekerja
              </Typography>
              <TextField
                type="date"
                name="tgl_mulai_bekerja"
                fullWidth
                value={form.tgl_mulai_bekerja}
                onChange={handleChange}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>

            <Grid size={6} item xs={12} md={6}>
              <Typography variant="subtitle1" fontWeight="bold">
                Departemen
              </Typography>
              <TextField
                name="departemen"
                fullWidth
                value={form.departemen}
                onChange={handleChange}
              />
            </Grid>

            <Grid size={6} item xs={12} md={6}>
              <Typography variant="subtitle1" fontWeight="bold">
                Supervisor
              </Typography>
              <TextField
                name="supervisor"
                fullWidth
                value={form.supervisor}
                onChange={handleChange}
              />
            </Grid>
          </Grid>
        </Box>

        {/* Pengaturan Akun */}
        <Box p={3}>
          <Typography variant="subtitle1" fontWeight="bold">
            Pengaturan Akun
          </Typography>
          <Divider sx={{ my: 1 }} />

          <Box mt={2}>
            <Button variant="outlined">Ubah Kata Sandi</Button>
          </Box>
        </Box>
      </Paper>
    </Box>
  );
}
