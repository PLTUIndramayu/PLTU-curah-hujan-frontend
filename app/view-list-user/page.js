"use client";
import { Header } from "../component/header";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

import { Button, Table } from "@mui/material";
import { BodyTableViewData, HeadTableViewData } from "./helper";

import { useUsers } from "../api/user";
import DownloadIcon from "@mui/icons-material/Download";
import PrintIcon from "@mui/icons-material/Print";

export default function ViewListUser() {
  const handleExport = () => {
    if (!rows || rows.length === 0) return;

    const worksheet = XLSX.utils.json_to_sheet(rows);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Curah Hujan");

    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });
    const data = new Blob([excelBuffer], { type: "application/octet-stream" });
    saveAs(data, `curah-hujan-${bulan}-${tahun}.xlsx`);
  };

  const handlePrint = () => {
    window.print();
  };

  const rows = useUsers();

  return (
    <>
      <div className="p-6 space-y-6">
        <Header />
      </div>
      <div className="p-6 bg-gray-100 min-h-screen">
        <div className="max-w-7xl mx-auto p-1 space-y-10">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 mb-4">
            <h1 className="text-xl font-bold">Daftar User</h1>
            <div className="flex gap-2">
              <div className="flex flex-col sm:flex-row gap-2">
                <Button
                  variant="contained"
                  startIcon={<DownloadIcon />}
                  onClick={handleExport}
                  className="!bg-green-600 hover:!bg-green-600 !normal-case rounded-lg shadow-md px-6 py-2"
                  sx={{
                    textTransform: "none",
                    borderRadius: 2,
                    boxShadow: 2,
                    px: 3,
                    py: 1,
                  }}
                >
                  Ekspor
                </Button>

                <Button
                  variant="contained"
                  startIcon={<PrintIcon />}
                  onClick={handlePrint}
                  className="!bg-blue-500 hover:!bg-blue-600 !normal-case rounded-lg shadow-md px-6 py-2 ml-5"
                  sx={{
                    textTransform: "none",
                    borderRadius: 2,
                    boxShadow: 2,
                    px: 3,
                    py: 1,
                  }}
                >
                  Cetak
                </Button>
              </div>
            </div>
          </div>

          {/* Tabel */}
          <div className="bg-white rounded shadow p-8 mb-6 overflow-x-auto">
            <Table className="min-w-[600px] border-collapse">
              <HeadTableViewData />
              <BodyTableViewData rows={rows} />
            </Table>
          </div>
        </div>
      </div>
    </>
  );
}
