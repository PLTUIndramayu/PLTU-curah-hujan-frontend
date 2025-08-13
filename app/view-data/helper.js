import { TableBody, TableCell, TableHead, TableRow } from "@mui/material";

export function HeadTableViewData() {
  return (
    <TableHead>
      <TableRow>
        <TableCell>Tanggal</TableCell>
        <TableCell>Jam</TableCell>
        <TableCell>Umur HSS</TableCell>
        <TableCell>Umur Tanaman</TableCell>
        <TableCell>Curah Hujan (mm)</TableCell>
        <TableCell>Sifat Hujan</TableCell>
      </TableRow>
    </TableHead>
  );
}

export function BodyTableViewData({ rows }) {
  return (
    <TableBody>
      {Array.isArray(rows) && rows.length > 0 ? (
        rows.map((item, index) => (
          <TableRow key={index}>
            <TableCell>
              {item.tanggal
                ? new Date(item.tanggal).toLocaleDateString("id-ID", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })
                : ""}
            </TableCell>
            <TableCell>
              {item.jam
                ? new Date(`1970-01-01T${item.jam}`).toLocaleTimeString(
                    "id-ID",
                    {
                      hour: "2-digit",
                      minute: "2-digit",
                    }
                  )
                : ""}
            </TableCell>
            <TableCell>{item.umur_hss} hari</TableCell>
            <TableCell>{item.umur_tanaman}</TableCell>
            <TableCell>{item.curah_hujan} mm</TableCell>
            <TableCell>{item.sifat_hujan}</TableCell>
          </TableRow>
        ))
      ) : (
        <TableRow>
          <TableCell colSpan={6} align="center">
            Tidak ada data
          </TableCell>
        </TableRow>
      )}
    </TableBody>
  );
}
