import { Button } from "@mui/material";
import { HelpCircle } from "lucide-react";

export function Header() {
  return (
    <div className="flex justify-between items-center rounded-xl mx-auto p-2 shadow-md">
      <header className="bg-white p-4">
        <h1 className="text-2xl font-bold">Sistem Monitoring Curah Hujan</h1>
        <p className="text-sm">Pantau data curah hujan secara real-time</p>
      </header>
      <div className="flex gap-2">
        <Button variant="outline" className="flex items-center gap-2">
          <HelpCircle className="w-4 h-4" /> Bantuan
        </Button>
        <Button variant="ghost">Admin</Button>
      </div>
    </div>
  );
}
