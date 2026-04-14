import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import { AppLayout } from "./components/layout/AppLayout"
import Dashboard from "./pages/Dashboard"
import BukuKas from "./pages/BukuKas"
import Analisis from "./pages/Analisis"
import Inventory from "./pages/Inventory"
import Reports from "./pages/Reports"
import Settings from "./pages/Settings"
import { TooltipProvider } from "@/components/ui/tooltip"

export default function App() {
  return (
    <TooltipProvider>
      <Router>
        <Routes>
          <Route path="/" element={<AppLayout />}>
            <Route index element={<Dashboard />} />
            <Route path="buku-kas" element={<BukuKas />} />
            <Route path="analisis" element={<Analisis />} />
            <Route path="inventory" element={<Inventory />} />
            <Route path="reports" element={<Reports />} />
            <Route path="settings" element={<Settings />} />
          </Route>
        </Routes>
      </Router>
    </TooltipProvider>
  )
}
