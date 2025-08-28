"use client";
import { AlertTriangle } from "lucide-react";
import { useEffect, useState } from "react";
import {
  Box,
  Button,
  TextField,
  Typography,
  Avatar,
  Grid,
  Paper,
  Divider,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import { useRouter } from "next/navigation";
import { useProfile } from "../api/user";
import { Header } from "../component/header";

export default function ProfilePage() {
  const router = useRouter();
  const rows = useProfile();
  const [form, setForm] = useState({
    kode_user: "",
    jabatan: "",
    email: "",
    foto_profil: "",
    nomor_telepon: "",
    nama: "",
    tanggal_lahir: "",
    alamat: "",
    kode_stasiun: "",
    tgl_mulai_bekerja: "",
    departemen: "",
    supervisor: "",
  });
  const [preview, setPreview] = useState(null);
  const [file, setFile] = useState(null);
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      setPreview(URL.createObjectURL(selectedFile));

      setForm((prev) => ({
        ...prev,
        foto_profil: selectedFile,
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    Object.keys(form).forEach((key) => {
      if (form[key]) {
        formData.append(key, form[key]);
      }
    });

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/auth/update-profile/${rows?.id}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: formData,
        }
      );

      if (!response.ok) {
        const error = await response.json().catch(() => ({}));
        throw new Error(error.message || "Gagal mengirim data");
      }

      const data = await response.json();
      console.log("Data berhasil dikirim:", data);

      alert("Profil berhasil diperbarui.");
      window.location.reload();
    } catch (error) {
      console.error("Terjadi kesalahan:", error);
      alert("Terjadi kesalahan saat mengirim data: " + error.message);
    }
  };

  useEffect(() => {
    if (rows) {
      setForm((prev) => ({
        ...prev,
        ...rows,
        tanggal_lahir: rows.tanggal_lahir
          ? new Date(rows.tanggal_lahir).toISOString().split("T")[0]
          : "",
        tgl_mulai_bekerja: rows.tgl_mulai_bekerja
          ? new Date(rows.tgl_mulai_bekerja).toISOString().split("T")[0]
          : "",
      }));
    }
  }, [rows]);

  const handleHapusAkun = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/auth/delete-user${rows?.id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: formData,
        }
      );

      if (!response.ok) {
        const error = await response.json().catch(() => ({}));
        throw new Error(error.message || "Gagal menghapus akun");
      }

      const data = await response.json();

      alert("Akun berhasil dihapus.");
      window.location.reload();
    } catch (error) {
      console.error("Terjadi kesalahan:", error);
      alert("Terjadi kesalahan saat menghapus akun: " + error.message);
    }
  };

  const [openDialog, setOpenDialog] = useState(false);

  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    setOpen(false);
    setEmail("");
    setMessage("");
  };

  const handleForgot = async (e) => {
    e.preventDefault();
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/auth/forgot-password`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      }
    );
    alert(
      "Link reset password telah dikirim ke email Anda. Cek spam jika tidak menemukan emailnya."
    );
    const data = await res.json();
    setMessage(data.message);
  };

  return (
    <Box>
      <div className="p-6 space-y-6">
        <Header />
        <Paper elevation={3} sx={{ p: 3, borderRadius: 3 }}>
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
          >
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
                sx={{ textTransform: "none" }}
              >
                Batal
              </Button>
              &nbsp; &nbsp;
              <Button
                variant="contained"
                onClick={handleSubmit}
                sx={{ textTransform: "none" }}
              >
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
                  src={preview || rows?.foto_profil}
                  sx={{ width: 100, height: 100, ml: 1 }}
                />

                <input
                  type="file"
                  accept="image/*"
                  id="upload-avatar"
                  style={{ display: "none" }}
                  onChange={handleFileChange}
                />
                <label htmlFor="upload-avatar">
                  <Button
                    sx={{ textTransform: "none" }}
                    variant="texted"
                    component="span"
                  >
                    Unggah foto
                  </Button>
                </label>
              </div>
              <div className="flex flex-col gap-1"></div>
              <div className="flex flex-col gap-1">
                <Typography variant="subtitle1" fontWeight="bold">
                  Kode User
                </Typography>
                <TextField
                  name="kode_user"
                  fullWidth
                  value={form.kode_user ?? rows?.kode_user ?? ""}
                  onChange={handleChange}
                />
              </div>

              <div className="flex flex-col gap-1">
                <Typography variant="subtitle1" fontWeight="bold">
                  Jabatan*
                </Typography>
                <TextField
                  name="jabatan"
                  placeholder="Masukkan jabatan Anda"
                  fullWidth
                  value={form.jabatan ?? rows?.jabatan ?? ""}
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
                  value={form.email ?? rows?.email ?? ""}
                  onChange={handleChange}
                />
              </div>
              <div className="flex flex-col gap-1">
                <Typography variant="subtitle1" fontWeight="bold">
                  Nomor Telepon*
                </Typography>
                <TextField
                  name="nomor_telepon"
                  placeholder="Masukkan nomor telepon Anda"
                  fullWidth
                  value={form.nomor_telepon ?? rows?.nomor_telepon ?? ""}
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
                  placeholder="Masukkan nama lengkap Anda"
                  fullWidth
                  value={form.nama ?? rows?.nama ?? ""}
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
                  value={form.tanggal_lahir ?? rows?.tanggal_lahir ?? ""}
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
              placeholder="Masukkan alamat lengkap Anda"
              fullWidth
              multiline
              rows={2}
              value={form.alamat ?? rows?.alamat ?? ""}
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
                  placeholder="Masukkan kode stasiun Anda"
                  fullWidth
                  value={form.kode_stasiun ?? rows?.kode_stasiun ?? ""}
                  onChange={handleChange}
                />
              </Grid>

              <Grid size={6} item xs={12} md={6}>
                <Typography variant="subtitle1" fontWeight="bold">
                  Tgl Mulai Bekerja
                </Typography>
                <TextField
                  type="date"
                  name="tgl_mulai_bekerja"
                  fullWidth
                  value={
                    form.tgl_mulai_bekerja ?? rows?.tgl_mulai_bekerja ?? ""
                  }
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
                  placeholder="Masukkan departemen Anda"
                  fullWidth
                  value={form.departemen ?? rows?.departemen ?? ""}
                  onChange={handleChange}
                />
              </Grid>

              <Grid size={6} item xs={12} md={6}>
                <Typography variant="subtitle1" fontWeight="bold">
                  Supervisor
                </Typography>
                <TextField
                  name="supervisor"
                  placeholder="Masukkan nama supervisor Anda"
                  fullWidth
                  value={form.supervisor ?? rows?.supervisor ?? ""}
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
              <Button
                sx={{ textTransform: "none" }}
                variant="outlined"
                onClick={handleOpen}
              >
                Ubah Kata Sandi
              </Button>
              <Button
                onClick={() => setOpenDialog(true)}
                sx={{ ml: 2, textTransform: "none" }}
                variant="outlined"
                color="error"
              >
                Hapus Akun
              </Button>
            </Box>
          </Box>
        </Paper>

        <Dialog
          open={openDialog}
          onClose={() => setOpenDialog(false)}
          PaperProps={{
            sx: { borderRadius: 3, padding: 1, minWidth: 350 },
          }}
        >
          <Box
            display="flex"
            flexDirection="column"
            alignItems="center"
            sx={{ mt: 2 }}
          >
            <AlertTriangle size={40} color="#f44336" />
            <DialogTitle
              sx={{ fontWeight: "bold", textAlign: "center", mt: 1 }}
            >
              Konfirmasi Hapus Akun
            </DialogTitle>
          </Box>

          <DialogContent>
            <Typography variant="body1" textAlign="center">
              Apakah Anda yakin ingin menghapus akun ini?
            </Typography>
          </DialogContent>

          <DialogActions sx={{ justifyContent: "center", gap: 2, pb: 2 }}>
            <Button
              onClick={() => setOpenDialog(false)}
              variant="outlined"
              sx={{ borderRadius: 2, px: 3 }}
            >
              Batal
            </Button>
            <Button
              onClick={handleHapusAkun}
              color="error"
              variant="contained"
              sx={{ borderRadius: 2, px: 3 }}
            >
              Hapus
            </Button>
          </DialogActions>
        </Dialog>

        <Dialog open={open} onClose={handleClose} maxWidth="xs" fullWidth>
          <DialogTitle>Lupa Password</DialogTitle>
          <DialogContent>
            <form onSubmit={handleForgot}>
              <TextField
                type="email"
                placeholder="Masukkan email*"
                fullWidth
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                margin="normal"
                required
              />
              {/* {message && (
                <Typography variant="body2"  sx={{ mt: 1 }}>
                  {message}
                </Typography>
              )} */}
              <DialogActions sx={{ px: 0, pt: 2 }}>
                <Button
                  color="error"
                  onClick={handleClose}
                  sx={{ textTransform: "none" }}
                >
                  Batal
                </Button>
                <Button
                  type="submit"
                  variant="contained"
                  sx={{ textTransform: "none", borderRadius: 3 }}
                  onClick={() => setOpen(false)}
                >
                  Kirim Link Reset
                </Button>
              </DialogActions>
            </form>
          </DialogContent>
        </Dialog>
      </div>
    </Box>
  );
}
