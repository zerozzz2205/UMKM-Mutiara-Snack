import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { FileText, Download, FileSpreadsheet, FileJson, Calendar, ChevronRight, Share2 } from "lucide-react"
import { Badge } from "@/components/ui/badge"

const reportTypes = [
  { 
    title: "Laporan Laba Rugi", 
    description: "Ringkasan pendapatan, pengeluaran, dan laba bersih.",
    icon: FileText,
    color: "bg-primary",
    formats: ["PDF", "Excel"]
  },
  { 
    title: "Laporan Arus Kas", 
    description: "Detail mutasi kas masuk dan keluar secara kronologis.",
    icon: BarChart3,
    color: "bg-info",
    formats: ["PDF", "Excel", "CSV"]
  },
  { 
    title: "Laporan Stok Barang", 
    description: "Status inventaris, nilai stok, dan barang menipis.",
    icon: Package,
    color: "bg-warning",
    formats: ["Excel", "PDF"]
  },
  { 
    title: "Laporan Pajak (PPN)", 
    description: "Estimasi kewajiban pajak berdasarkan transaksi.",
    icon: FileSpreadsheet,
    color: "bg-danger",
    formats: ["PDF"]
  },
]

import { BarChart3, Package } from "lucide-react"

export default function Reports() {
  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-1">
        <h1 className="text-3xl font-bold tracking-tight">Laporan Export</h1>
        <p className="text-muted-foreground">Download data keuangan Anda dalam berbagai format profesional.</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {reportTypes.map((report) => (
          <Card key={report.title} className="border-none shadow-md group hover:shadow-lg transition-all duration-300">
            <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-4">
              <div className="flex gap-4">
                <div className={`h-12 w-12 rounded-2xl ${report.color} text-white flex items-center justify-center shadow-lg shadow-current/20`}>
                  <report.icon className="h-6 w-6" />
                </div>
                <div className="space-y-1">
                  <CardTitle className="text-lg font-bold">{report.title}</CardTitle>
                  <CardDescription className="text-xs leading-relaxed">{report.description}</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between pt-2">
                <div className="flex gap-2">
                  {report.formats.map(format => (
                    <Badge key={format} variant="secondary" className="text-[10px] font-bold uppercase tracking-widest px-2 py-0.5">
                      {format}
                    </Badge>
                  ))}
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm" className="h-9 px-4 font-bold uppercase tracking-widest text-[10px]">
                    Preview
                  </Button>
                  <Button size="sm" className="h-9 px-4 font-bold uppercase tracking-widest text-[10px]">
                    <Download className="mr-2 h-3.5 w-3.5" /> Download
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="border-none shadow-md overflow-hidden">
        <CardHeader className="bg-muted/30 border-b">
          <CardTitle className="text-lg font-bold">Riwayat Export Terakhir</CardTitle>
          <CardDescription>Daftar laporan yang baru saja Anda buat</CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <div className="divide-y divide-muted/50">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-center justify-between p-4 hover:bg-muted/10 transition-colors">
                <div className="flex items-center gap-4">
                  <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center">
                    <FileText className="h-5 w-5 text-muted-foreground" />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-sm font-semibold">Laporan_Laba_Rugi_April_2024.pdf</span>
                    <span className="text-[10px] text-muted-foreground font-medium uppercase tracking-widest">Dibuat 14 April 2024 • 2.4 MB</span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <Share2 className="h-4 w-4 text-muted-foreground" />
                  </Button>
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <Download className="h-4 w-4 text-muted-foreground" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="p-8 rounded-3xl bg-primary/5 border border-primary/10 flex flex-col items-center text-center space-y-4">
        <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center">
          <Calendar className="h-8 w-8 text-primary" />
        </div>
        <div className="space-y-1 max-w-md">
          <h3 className="text-lg font-bold">Jadwalkan Laporan Otomatis</h3>
          <p className="text-sm text-muted-foreground">
            Kirim laporan keuangan langsung ke email Anda setiap hari Senin pukul 08:00 WIB.
          </p>
        </div>
        <Button className="font-bold uppercase tracking-widest text-xs h-11 px-8">
          Aktifkan Penjadwalan
        </Button>
      </div>
    </div>
  )
}
