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
import { Badge } from "@/components/ui/badge"
import { Search, Plus, Package, AlertTriangle, ArrowRight, History, BarChart3 } from "lucide-react"
import { formatRupiah } from "@/lib/format"

const inventory = [
  { id: '1', name: 'Biji Kopi Arabica (1kg)', sku: 'KOP-001', stock: 12, minStock: 5, price: 185000, category: 'Bahan Baku' },
  { id: '2', name: 'Susu UHT Full Cream', sku: 'SUS-002', stock: 3, minStock: 10, price: 18500, category: 'Bahan Baku' },
  { id: '3', name: 'Gula Aren Cair (5L)', sku: 'GUL-003', stock: 8, minStock: 3, price: 125000, category: 'Bahan Baku' },
  { id: '4', name: 'Cup Plastik 16oz', sku: 'CUP-004', stock: 450, minStock: 200, price: 450, category: 'Kemasan' },
  { id: '5', name: 'Sedotan Bambu', sku: 'SED-005', stock: 150, minStock: 100, price: 250, category: 'Kemasan' },
  { id: '6', name: 'Bubuk Cokelat Premium', sku: 'COK-006', stock: 2, minStock: 5, price: 95000, category: 'Bahan Baku' },
]

export default function Inventory() {
  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold tracking-tight">Manajemen Stok</h1>
          <p className="text-muted-foreground">Pantau ketersediaan bahan baku dan aset toko Anda.</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" className="font-bold uppercase tracking-widest text-xs h-10">
            <History className="mr-2 h-4 w-4" /> Riwayat Stok
          </Button>
          <Button className="font-bold uppercase tracking-widest text-xs h-10">
            <Plus className="mr-2 h-4 w-4" /> Tambah Barang
          </Button>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Card className="border-none shadow-md">
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Total Item</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">124 Item</div>
            <p className="text-[10px] text-muted-foreground mt-1 font-medium uppercase tracking-tight">Tersebar di 5 Kategori</p>
          </CardContent>
        </Card>
        <Card className="border-none shadow-md">
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-bold uppercase tracking-widest text-danger">Stok Menipis</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-danger">8 Item</div>
            <p className="text-[10px] text-danger/60 mt-1 font-medium uppercase tracking-tight">Segera lakukan restock</p>
          </CardContent>
        </Card>
        <Card className="border-none shadow-md">
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-bold uppercase tracking-widest text-info">Nilai Inventaris</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatRupiah(18450000)}</div>
            <p className="text-[10px] text-info/60 mt-1 font-medium uppercase tracking-tight">Total nilai modal barang</p>
          </CardContent>
        </Card>
      </div>

      <Card className="border-none shadow-md overflow-hidden">
        <CardHeader className="bg-white border-b flex flex-row items-center justify-between py-4">
          <div className="relative w-full max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Cari barang atau SKU..." className="pl-10 bg-muted/30 border-none h-10" />
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" className="h-8 text-[10px] font-bold uppercase tracking-widest">Semua</Button>
            <Button variant="ghost" size="sm" className="h-8 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Bahan Baku</Button>
            <Button variant="ghost" size="sm" className="h-8 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Kemasan</Button>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader className="bg-muted/30">
              <TableRow className="hover:bg-transparent border-none">
                <TableHead className="text-[10px] font-bold uppercase tracking-widest pl-6">Barang</TableHead>
                <TableHead className="text-[10px] font-bold uppercase tracking-widest">SKU</TableHead>
                <TableHead className="text-[10px] font-bold uppercase tracking-widest">Kategori</TableHead>
                <TableHead className="text-[10px] font-bold uppercase tracking-widest text-center">Stok</TableHead>
                <TableHead className="text-[10px] font-bold uppercase tracking-widest text-right">Harga Satuan</TableHead>
                <TableHead className="text-[10px] font-bold uppercase tracking-widest text-right pr-6">Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {inventory.map((item) => {
                const isLow = item.stock <= item.minStock
                return (
                  <TableRow key={item.id} className="group hover:bg-muted/20 transition-colors border-b border-muted/50">
                    <TableCell className="pl-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className={`h-8 w-8 rounded-lg flex items-center justify-center ${isLow ? 'bg-danger/10 text-danger' : 'bg-primary/10 text-primary'}`}>
                          <Package className="h-4 w-4" />
                        </div>
                        <span className="text-sm font-semibold">{item.name}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className="text-xs font-mono text-muted-foreground">{item.sku}</span>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="text-[10px] font-bold uppercase tracking-tight bg-muted/50 border-none">
                        {item.category}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-center">
                      <div className="flex flex-col items-center gap-1">
                        <span className={`text-sm font-bold ${isLow ? 'text-danger' : 'text-foreground'}`}>
                          {item.stock}
                        </span>
                        {isLow && (
                          <div className="flex items-center gap-1 text-[8px] font-bold text-danger uppercase tracking-tighter">
                            <AlertTriangle className="h-2 w-2" /> Menipis
                          </div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <span className="text-sm font-medium">{formatRupiah(item.price)}</span>
                    </TableCell>
                    <TableCell className="text-right pr-6">
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                        <ArrowRight className="h-4 w-4 text-muted-foreground" />
                      </Button>
                    </TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
