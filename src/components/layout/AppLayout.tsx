import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar"
import { AppSidebar } from "./AppSidebar"
import { AppHeader } from "./AppHeader"
import { Outlet } from "react-router-dom"
import { motion, AnimatePresence } from "framer-motion"
import { useLocation } from "react-router-dom"
import { Plus, ArrowUpRight, ArrowDownLeft, CreditCard } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export function AppLayout() {
  const location = useLocation()

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full bg-background">
        <AppSidebar />
        <SidebarInset className="flex flex-col">
          <AppHeader />
          <main className="flex-1 overflow-y-auto p-6 md:p-8">
            <AnimatePresence mode="wait">
              <motion.div
                key={location.pathname}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2, ease: "easeOut" }}
                className="mx-auto w-full max-w-7xl"
              >
                <Outlet />
              </motion.div>
            </AnimatePresence>
          </main>
          
          {/* Floating Action Button */}
          <div className="fixed bottom-8 right-8 z-50">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button size="icon" className="h-14 w-14 rounded-full shadow-lg shadow-primary/20 hover:scale-105 transition-transform">
                  <Plus className="h-6 w-6" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="mb-4 w-56 p-2 gap-1 flex flex-col">
                <DropdownMenuItem className="cursor-pointer py-3 rounded-lg hover:bg-success/10 hover:text-success transition-colors">
                  <ArrowUpRight className="mr-3 h-5 w-5 text-success" />
                  <div className="flex flex-col">
                    <span className="font-semibold text-sm">Tambah Pemasukan</span>
                    <span className="text-[10px] text-muted-foreground">Catat penjualan atau modal</span>
                  </div>
                </DropdownMenuItem>
                <DropdownMenuItem className="cursor-pointer py-3 rounded-lg hover:bg-danger/10 hover:text-danger transition-colors">
                  <ArrowDownLeft className="mr-3 h-5 w-5 text-danger" />
                  <div className="flex flex-col">
                    <span className="font-semibold text-sm">Tambah Pengeluaran</span>
                    <span className="text-[10px] text-muted-foreground">Catat biaya operasional</span>
                  </div>
                </DropdownMenuItem>
                <DropdownMenuItem className="cursor-pointer py-3 rounded-lg hover:bg-info/10 hover:text-info transition-colors">
                  <CreditCard className="mr-3 h-5 w-5 text-info" />
                  <div className="flex flex-col">
                    <span className="font-semibold text-sm">Catat Hutang</span>
                    <span className="text-[10px] text-muted-foreground">Pantau piutang pelanggan</span>
                  </div>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          <footer className="border-t py-4 px-8 flex justify-between items-center text-[10px] text-muted-foreground uppercase tracking-widest font-medium">
            <span>FinUMKM v1.0.0</span>
            <span>Last updated 2 minutes ago by Kadek</span>
          </footer>
        </SidebarInset>
      </div>
    </SidebarProvider>
  )
}
