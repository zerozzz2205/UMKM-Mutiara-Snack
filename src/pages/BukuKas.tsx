import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Search,
  Plus,
  Filter,
  ArrowUpRight,
  ArrowDownLeft,
  MoreVertical,
  Calendar as CalendarIcon,
  Image as ImageIcon,
  CheckCircle2,
  AlertCircle
} from "lucide-react"
import { formatRupiah, formatDate } from "@/lib/format"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"

const initialTransactions = [
  { id: '1', date: '2024-04-13', description: 'Penjualan Kopi Susu (15 Cup)', amount: 375000, type: 'income', category: 'Penjualan', method: 'Tunai' },
  { id: '2', date: '2024-04-13', description: 'Beli Susu UHT 1 Karton', amount: 210000, type: 'expense', category: 'Bahan Baku', method: 'Transfer' },
  { id: '3', date: '2024-04-12', description: 'Bayar Listrik Toko', amount: 450000, type: 'expense', category: 'Operasional', method: 'Transfer' },
  { id: '4', date: '2024-04-12', description: 'Penjualan Nasi Goreng (8 Porsi)', amount: 240000, type: 'income', category: 'Penjualan', method: 'QRIS' },
  { id: '5', date: '2024-04-11', description: 'Sewa Tempat (Bulan April)', amount: 2500000, type: 'expense', category: 'Sewa', method: 'Transfer' },
  { id: '6', date: '2024-04-11', description: 'Penjualan Paket Bukber', amount: 1250000, type: 'income', category: 'Penjualan', method: 'Transfer' },
]

export default function BukuKas() {
  const [transactions, setTransactions] = useState(initialTransactions)
  const [searchTerm, setSearchTerm] = useState('')

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold tracking-tight">Buku Kas Utama</h1>
          <p className="text-muted-foreground">Kelola semua arus kas masuk dan keluar bisnis Anda.</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" className="font-bold uppercase tracking-widest text-xs h-10">
            <Filter className="mr-2 h-4 w-4" /> Filter
          </Button>
          <Button className="font-bold uppercase tracking-widest text-xs h-10">
            <Plus className="mr-2 h-4 w-4" /> Transaksi Baru
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Side: Transaction List */}
        <div className="lg:col-span-8 space-y-6">
          <Card className="border-none shadow-md overflow-hidden">
            <CardHeader className="bg-white border-b pb-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input 
                  placeholder="Cari deskripsi, kategori, atau nominal..." 
                  className="pl-10 bg-muted/30 border-none h-11"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <ScrollArea className="h-[600px]">
                <Table>
                  <TableHeader className="bg-muted/30">
                    <TableRow className="hover:bg-transparent border-none">
                      <TableHead className="w-[120px] text-[10px] font-bold uppercase tracking-widest pl-6">Tanggal</TableHead>
                      <TableHead className="text-[10px] font-bold uppercase tracking-widest">Deskripsi</TableHead>
                      <TableHead className="text-[10px] font-bold uppercase tracking-widest">Kategori</TableHead>
                      <TableHead className="text-right text-[10px] font-bold uppercase tracking-widest pr-6">Nominal</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {transactions.map((t) => (
                      <TableRow key={t.id} className="group cursor-pointer hover:bg-muted/20 transition-colors border-b border-muted/50">
                        <TableCell className="pl-6 py-4">
                          <span className="text-xs font-medium text-muted-foreground">{formatDate(t.date)}</span>
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-col">
                            <span className="text-sm font-semibold text-foreground">{t.description}</span>
                            <span className="text-[10px] text-muted-foreground font-medium">{t.method}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className="text-[10px] font-bold uppercase tracking-tight bg-muted/50 border-none">
                            {t.category}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right pr-6">
                          <div className="flex items-center justify-end gap-2">
                            <span className={`text-sm font-bold ${t.type === 'income' ? 'text-success' : 'text-danger'}`}>
                              {t.type === 'income' ? '+' : '-'} {formatRupiah(t.amount)}
                            </span>
                            {t.type === 'income' ? <ArrowUpRight className="h-3 w-3 text-success" /> : <ArrowDownLeft className="h-3 w-3 text-danger" />}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </ScrollArea>
            </CardContent>
          </Card>
        </div>

        {/* Right Side: Smart Form */}
        <div className="lg:col-span-4 space-y-6">
          <Card className="border-none shadow-md sticky top-24">
            <CardHeader className="border-b">
              <CardTitle className="text-lg font-bold">Input Cepat</CardTitle>
              <CardDescription>Tambah transaksi baru dengan Smart Form</CardDescription>
            </CardHeader>
            <CardContent className="pt-6 space-y-6">
              <div className="grid grid-cols-2 gap-2 p-1 bg-muted rounded-lg">
                <Button variant="ghost" className="bg-white shadow-sm text-success font-bold text-xs uppercase tracking-widest h-9">
                  Pemasukan
                </Button>
                <Button variant="ghost" className="text-muted-foreground font-bold text-xs uppercase tracking-widest h-9">
                  Pengeluaran
                </Button>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Deskripsi Transaksi</label>
                  <Input placeholder="Contoh: Penjualan Kopi Susu" className="h-11 bg-muted/20 border-none" />
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Nominal (Rp)</label>
                  <Input type="number" placeholder="0" className="h-11 bg-muted/20 border-none text-lg font-bold text-primary" />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Kategori</label>
                    <div className="h-11 bg-muted/20 rounded-md flex items-center px-3 text-sm text-muted-foreground cursor-pointer hover:bg-muted/40 transition-colors">
                      Pilih Kategori
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Metode</label>
                    <div className="h-11 bg-muted/20 rounded-md flex items-center px-3 text-sm text-muted-foreground cursor-pointer hover:bg-muted/40 transition-colors">
                      Tunai
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Lampiran / Struk</label>
                  <div className="h-24 border-2 border-dashed border-muted rounded-xl flex flex-col items-center justify-center gap-2 text-muted-foreground hover:bg-muted/20 transition-all cursor-pointer">
                    <ImageIcon className="h-6 w-6" />
                    <span className="text-[10px] font-bold uppercase tracking-widest">Upload Foto (OCR)</span>
                  </div>
                </div>
              </div>

              <div className="pt-4 space-y-3">
                <Button className="w-full h-12 font-bold uppercase tracking-widest text-xs shadow-lg shadow-primary/20">
                  Simpan Transaksi
                </Button>
                <div className="flex items-center justify-center gap-2 text-[10px] text-muted-foreground font-medium uppercase tracking-wider">
                  <CheckCircle2 className="h-3 w-3 text-success" />
                  Data akan tersinkronisasi otomatis
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-none shadow-md bg-warning/5 border border-warning/20">
            <CardContent className="p-4 flex gap-3">
              <AlertCircle className="h-5 w-5 text-warning shrink-0" />
              <div className="space-y-1">
                <p className="text-xs font-bold text-warning uppercase tracking-tight">Deteksi Anomali</p>
                <p className="text-[10px] text-warning/80 leading-relaxed font-medium">
                  Ada 2 transaksi "Bahan Baku" dengan harga 15% lebih tinggi dari rata-rata bulan lalu.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
