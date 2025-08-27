"use client";
import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button, TextField } from "@mui/material";

export default function ResetPassword() {
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const router = useRouter();
  const { token } = useParams();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/auth/reset-password/${token}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      }
    );
    const data = await res.json();
    alert("Password berhasil direset. Silakan login dengan password baru.");
    setMessage(data.message);
    if (res.ok) {
      setTimeout(() => router.push("/login"), 2000);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="bg-white shadow-lg rounded-2xl p-6 w-full max-w-md">
        <h2 className="text-xl font-bold mb-4">Reset Password</h2>
        <form onSubmit={handleSubmit}>
          <TextField
            type="password"
            placeholder="Masukkan password baru*"
            fullWidth
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            margin="normal"
            required
          />
          <div className="pt-4 flex justify-end">
            <Button
              type="submit"
              variant="contained"
              sx={{ textTransform: "none", borderRadius: 3 }}
            >
              Reset Password
            </Button>
          </div>
        </form>
        {/* {message && <p className="mt-4 ">{message}</p>} */}
      </div>
    </div>
  );
}
