"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Box,
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  Link,
  CircularProgress,
} from "@mui/material";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      alert("Email dan password harus diisi");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (res.ok) {
        localStorage.setItem("token", data.token);
        router.push("/dashboard");
      } else {
        alert(data.message || "Login gagal");
      }
    } catch (err) {
      console.error(err);
      alert("Terjadi kesalahan jaringan");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
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
        {/* Judul Sistem */}
        <Typography variant="h5" color="primary" fontWeight="bold" mb={4}>
          Sistem Monitoring Curah Hujan
        </Typography>

        {/* Card Login */}
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
            <Box
              sx={{ display: "flex", justifyContent: "center", mb: 2, mt: 4 }}
            >
              <LockOutlinedIcon sx={{ fontSize: 48, color: "primary.main" }} />
            </Box>

            {/* Judul Form */}
            <Typography variant="h5" textAlign="center" fontWeight="600">
              Login
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
              {/* Username / Email */}
              <TextField
                placeholder="Email"
                variant="outlined"
                fullWidth
                size="medium"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                sx={{ mb: 2 }}
              />

              {/* Password */}
              <TextField
                placeholder="Password"
                type="password"
                variant="outlined"
                fullWidth
                size="medium"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                sx={{ mb: 2 }}
              />

              {/* Tombol Login */}
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
                  "Login"
                )}
              </Button>

              {/* Lupa Password */}
              <Box textAlign="center" mb={2}>
                <Link
                  href="#"
                  underline="hover"
                  variant="body2"
                  color="primary"
                >
                  Lupa Password?
                </Link>
              </Box>

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
                <span>🔒 Login Aman</span>
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
    </>
  );
}
