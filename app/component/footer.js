"use client";

import { Box, Typography, Link, useMediaQuery } from "@mui/material";

export function Footer() {
  const isMobile = useMediaQuery("(max-width:600px)");

  return (
    <Box
      component="footer"
      sx={{
        mt: 8,
        py: 3,
        px: isMobile ? 1 : 4,
        bgcolor: "background.paper",
        borderTop: "1px solid #e0e0e0",
        textAlign: isMobile ? "center" : "left",
      }}
    >
      <Typography variant="body2" color="text.secondary">
        © {new Date().getFullYear()} Sistem Monitoring Curah Hujan • All rights
        reserved
      </Typography>

      {/* <Box
        sx={{
          display: "flex",
          flexDirection: isMobile ? "column" : "row",
          justifyContent: isMobile ? "center" : "flex-end",
          gap: 2,
          mt: 1,
        }}
      >
        <Link
          href="/"
          underline="hover"
          color="text.secondary"
          sx={{ fontSize: "0.85rem" }}
        >
          Beranda
        </Link>
        <Link
          href="/view-data"
          underline="hover"
          color="text.secondary"
          sx={{ fontSize: "0.85rem" }}
        >
          Data
        </Link>
        <Link
          href="/view-grafik"
          underline="hover"
          color="text.secondary"
          sx={{ fontSize: "0.85rem" }}
        >
          Grafik
        </Link>
        <Link
          href="/tentang"
          underline="hover"
          color="text.secondary"
          sx={{ fontSize: "0.85rem" }}
        >
          Tentang
        </Link>
      </Box> */}
    </Box>
  );
}
