import {
  Button,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Modal,
  Box,
  Table,
  TextField,
  TablePagination,
  Typography,
  useMediaQuery,
} from "@mui/material";
import { useEffect, useState } from "react";

import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { useGetCurahHujanById, useUpdateCurahHujan } from "../api/curah-hujan";

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

export function HeadTableViewData() {
  return (
    <>
      <TableHead sx={{ width: "100%" }}>
        <TableRow>
          <TableCell>Tanggal</TableCell>
          <TableCell>Umur HSS</TableCell>
          <TableCell>Umur Tanaman</TableCell>
          <TableCell>Curah Hujan (mm)</TableCell>
          <TableCell>Sifat Hujan</TableCell>
          <TableCell>Diinput oleh</TableCell>
          <TableCell>Action</TableCell>
        </TableRow>
      </TableHead>
    </>
  );
}

export function BodyTableViewData({ rows }) {
  const isMobile = useMediaQuery("(max-width:600px)");
  const [openModal, setOpenModal] = useState(false);
  const [openModalDetail, setOpenModalDetail] = useState(false);
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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const [selectedId, setSelectedId] = useState(null);

  const dataById = useGetCurahHujanById(selectedId);

  const handleOpenModal = (id) => {
    setSelectedId(id);
    setOpenModal(true);
  };

  const { updateCurahHujan } = useUpdateCurahHujan();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await updateCurahHujan(selectedId, form);
      alert("Data berhasil diupdate");
      setOpenModal(false);
      window.location.reload();
    } catch (err) {
      alert("Gagal update: " + err.message);
    }
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setOpenModalDetail(false);
  };

  const handleDelete = async (id) => {
    if (!confirm("Yakin ingin menghapus data ini?")) return;

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/curah-hujan/${id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "application/json",
          },
        }
      );
      alert("Data berhasil dihapus");

      if (!res.ok) throw new Error("Gagal menghapus data");
    } catch (err) {
      console.error(err);
      alert("Terjadi kesalahan saat menghapus data");
    }
  };

  useEffect(() => {
    if (openModal && dataById) {
      setForm({
        ...dataById,
        tanggal: dataById.tanggal
          ? new Date(dataById.tanggal).toISOString().split("T")[0]
          : "",
      });
    }
  }, [dataById, openModal]);

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleOpenModalDetail = (id) => {
    const selectedData = rows.find((item) => item.id === id);
    if (selectedData) {
      setForm({
        tanggal: selectedData.tanggal || "",
        jam: selectedData.jam || "",
        umur_hss: selectedData.umur_hss || "",
        umur_tanaman: selectedData.umur_tanaman || "",
        curah_hujan: selectedData.curah_hujan || "",
        sifat_hujan: selectedData.sifat_hujan || "",
        varietas: selectedData.varietas || "",
        sumber_air: selectedData.sumber_air || "",
        opt: selectedData.opt || "",
        keterangan: selectedData.keterangan || "",
        createdAt: selectedData.createdAt || "",
        updatedAt: selectedData.updatedAt || "",
      });
      setOpenModalDetail(true);
    }
  };

  return (
    <>
      <TableBody>
        {Array.isArray(rows) && rows.length > 0 ? (
          rows
            .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
            .map((item, index) => (
              <TableRow key={index}>
                <TableCell sx={{ width: '20%'}}>
                  {item.tanggal
                    ? new Date(item.tanggal).toLocaleDateString("id-ID", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })
                    : ""}
                </TableCell>

                <TableCell>{item.umur_hss || "-"} hari</TableCell>
                <TableCell>{item.umur_tanaman || "-"} hari</TableCell>
                <TableCell>{item.curah_hujan || "-"}</TableCell>
                <TableCell>{item.sifat_hujan || "-"}</TableCell>
                <TableCell>{item.User?.nama || "-"}</TableCell>
                <TableCell>
                  <Button
                    startIcon={
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        height="24"
                        width="24"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                      >
                        ,
                        <path d="M12 6.5C7 6.5 2.73 9.61 1 12c1.73 2.39 6 5.5 11 5.5s9.27-3.11 11-5.5c-1.73-2.39-6-5.5-11-5.5zm0 9c-2.48 0-4.5-2.02-4.5-4.5S9.52 6.5 12 6.5s4.5 2.02 4.5 4.5S14.48 15.5 12 15.5zm0-7c-1.38 0-2.5 1.12-2.5 2.5s1.12 2.5 2.5 2.5 2.5-1.12 2.5-2.5S13.38 8.5 12 8.5z" />
                      </svg>
                    }
                    sx={{ textTransform: "none" }}
                    onClick={() => handleOpenModalDetail(item.id)}
                  >
                    Lihat
                  </Button>
                  <Button
                    startIcon={<EditIcon />}
                    sx={{ textTransform: "none" }}
                    onClick={() => handleOpenModal(item.id)}
                  >
                    Edit
                  </Button>
                  <Button
                    startIcon={<DeleteIcon />}
                    sx={{ textTransform: "none" }}
                    color="error"
                    onClick={() => handleDelete(item.id)}
                  >
                    Hapus
                  </Button>
                </TableCell>
              </TableRow>
            ))
        ) : (
          <TableRow>
            <TableCell colSpan={7} align="center">
              Tidak ada data
            </TableCell>
          </TableRow>
        )}
      </TableBody>

      <>
        {/* Pagination */}
        <TablePagination
          component="div"
          count={rows.length}
          page={page}
          onPageChange={handleChangePage}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          rowsPerPageOptions={[5, 10, 25]}
          labelRowsPerPage="Baris per halaman"
        />
      </>
      <Modal open={openModal} onClose={handleCloseModal}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            bgcolor: "background.paper",
            boxShadow: 24,
            p: 3,
            borderRadius: 2,
            width: "100%",
            maxWidth: 800,
            maxHeight: "80vh",
            overflowY: "auto",
          }}
        >
          <FormInputData
            form={form}
            handleChange={handleChange}
            handleSubmit={handleSubmit}
            isMobile={isMobile}
          />
        </Box>
      </Modal>

      <Modal open={openModalDetail} onClose={handleCloseModal}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            bgcolor: "background.paper",
            boxShadow: 24,
            p: 3,
            borderRadius: 2,
            width: "100%",
            maxWidth: 800,
            maxHeight: "80vh",
            overflowY: "auto",
          }}
        >
          <Typography variant="h6" component="h2" gutterBottom>
            Detail Data Curah Hujan
          </Typography>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 5 }}>
            <Typography>
              <strong>Tanggal:</strong>{" "}
              {form.tanggal
                ? new Date(form.tanggal).toLocaleDateString("id-ID", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })
                : "-"}
            </Typography>
            <Typography>
              <strong>Jam:</strong> {form.jam}
            </Typography>
            <Typography>
              <strong>Umur HSS: </strong> {form.umur_hss || "-"}
            </Typography>
            <Typography>
              <strong>Umur Tanaman: </strong> {form.umur_tanaman || "-"}
            </Typography>
            <Typography>
              <strong>Curah Hujan: </strong> {form.curah_hujan || "-"}
            </Typography>
            <Typography>
              <strong>Sifat Hujan: </strong> {form.sifat_hujan || "-"}
            </Typography>
            <Typography>
              <strong>Varietas: </strong> {form.varietas || "-"}
            </Typography>
            <Typography>
              <strong>Sumber Air: </strong>
              {form.sumber_air || "-"}
            </Typography>
            <Typography>
              <strong>OPT: </strong>
              {form.opt || "-"}
            </Typography>
            <Typography>
              <strong>Keterangan: </strong>
              {form.keterangan || "-"}
            </Typography>
            <Typography>
              <strong>Dibuat pada: </strong>{" "}
              {form.createdAt
                ? new Date(form.createdAt).toLocaleDateString("id-ID", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })
                : "-"}
            </Typography>
            <Typography>
              <strong>Terakhir diupdate pada: </strong>{" "}
              {form.updatedAt
                ? new Date(form.updatedAt).toLocaleDateString("id-ID", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })
                : "-"}
            </Typography>
          </Box>
          <br />
        </Box>
      </Modal>
    </>
  );
}
