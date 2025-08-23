"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import PublicRoute from "../component/PublicRoute";
import {
  Box,
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  CircularProgress,
  FormControl,
  Select,
  MenuItem,
} from "@mui/material";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";

export default function RegisterPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("");
  const [loading, setLoading] = useState(false);

  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email || !password || !name || !role) {
      alert("Nama, email, password, dan role harus diisi");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/auth/register`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name, email, password, role }),
        }
      );

      const data = await res.json();
      alert(data.message, "Akun berhasil dibuat");

      if (res.ok) {
        localStorage.setItem("token", data.token);
        router.push("/login");
      } else {
        alert(data.message || "Register gagal");
      }
    } catch (err) {
      console.error(err);
      alert("Terjadi kesalahan jaringan");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#f9fafb",
        p: 2,
      }}
    >
      <Typography variant="h5" color="primary" fontWeight="bold" mt={3} mb={4}>
        Sistem Monitoring Curah Hujan
      </Typography>

      {/* Card Register */}
      <Card
        sx={{
          width: "100%",
          maxWidth: 500,
          boxShadow: 3,
          borderRadius: 3,
          px: 2,
        }}
      >
        <CardContent>
          {/* Icon */}
          <Box sx={{ display: "flex", justifyContent: "center", mb: 2, mt: 4 }}>
            <LockOutlinedIcon sx={{ fontSize: 48, color: "primary.main" }} />
          </Box>

          <Typography variant="h5" textAlign="center" fontWeight="600">
            Register
          </Typography>
          <Typography
            mt={4}
            variant="body2"
            textAlign="center"
            color="text.secondary"
            mb={3}
          >
            Masukkan kredensial Anda untuk mengakses sistem
          </Typography>

          <form onSubmit={handleSubmit}>
            <TextField
              placeholder="Nama Lengkap"
              variant="outlined"
              fullWidth
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              sx={{ mb: 2 }}
            />
            <TextField
              placeholder="Email"
              variant="outlined"
              fullWidth
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              sx={{ mb: 2 }}
            />
            <TextField
              placeholder="Password"
              type="password"
              variant="outlined"
              fullWidth
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              sx={{ mb: 2 }}
            />

            <FormControl fullWidth sx={{ mb: 2 }}>
              <Select
                displayEmpty
                value={role}
                onChange={(e) => setRole(e.target.value)}
                required
              >
                <MenuItem value="" disabled>
                  Pilih Role
                </MenuItem>
                <MenuItem value="user">User</MenuItem>
                <MenuItem value="admin">Admin</MenuItem>
              </Select>
            </FormControl>

            <Button
              type="submit"
              variant="contained"
              color="primary"
              fullWidth
              disabled={loading}
              sx={{ mt: 2, mb: 2 }}
            >
              {loading ? (
                <CircularProgress size={24} sx={{ color: "white" }} />
              ) : (
                "Register"
              )}
            </Button>

            {/* Info Keamanan */}
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                gap: 2,
                color: "text.secondary",
                fontSize: "0.75rem",
              }}
            >
              <span>🔒 Register Aman</span>
              <span>🔐 Terenkripsi</span>
            </Box>
          </form>
        </CardContent>
      </Card>

      {/* Footer */}
      <Typography
        variant="caption"
        color="text.secondary"
        textAlign="center"
        sx={{ mt: 5 }}
      >
        Dikembangkan oleh PLTU Indramayu | v1.0 <br />© 2025 Sistem Monitoring
        Curah Hujan. Hak Cipta Dilindungi.
      </Typography>
    </Box>
  );
}
