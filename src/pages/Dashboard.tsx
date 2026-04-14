import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  Wallet, 
  Building2, 
  AlertCircle,
  ArrowUpRight,
  ArrowDownRight,
  Calendar
} from "lucide-react"
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  BarChart,
  Bar,
  Cell
} from 'recharts'
import { formatRupiah, formatPercent } from "@/lib/format"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

const data = [
  { name: '1 Apr', revenue: 4500000, expenses: 3200000, forecast: 4500000 },
  { name: '5 Apr', revenue: 5200000, expenses: 3100000, forecast: 5200000 },
  { name: '10 Apr', revenue: 4800000, expenses: 3500000, forecast: 4800000 },
  { name: '15 Apr', revenue: 6100000, expenses: 3800000, forecast: 6100000 },
  { name: '20 Apr', revenue: 5500000, expenses: 3400000, forecast: 5500000 },
  { name: '25 Apr', revenue: 6800000, expenses: 4100000, forecast: 6800000 },
  { name: '30 Apr', revenue: 7200000, expenses: 4300000, forecast: 7200000 },
  { name: '5 Mei', forecast: 7500000 },
  { name: '10 Mei', forecast: 8200000 },
]

const topProducts = [
  { name: 'Kopi Susu Gula Aren', margin: 65, sales: 1200 },
  { name: 'Croissant Almond', margin: 45, sales: 850 },
  { name: 'Es Teh Kampul', margin: 80, sales: 2100 },
  { name: 'Nasi Goreng Spesial', margin: 35, sales: 450 },
]

export default function Dashboard() {
  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-1">
        <h1 className="text-3xl font-bold tracking-tight">Ringkasan Keuangan</h1>
        <p className="text-muted-foreground">Selamat datang kembali, Kadek. Berikut performa toko Anda bulan ini.</p>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card className="relative overflow-hidden border-none shadow-md bg-white">
          <div className="absolute top-0 left-0 h-full w-1.5 bg-success" />
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-bold uppercase tracking-wider text-muted-foreground">Omzet Bersih</CardTitle>
            <TrendingUp className="h-4 w-4 text-success" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatRupiah(45250000)}</div>
            <div className="flex items-center gap-1 mt-1">
              <Badge variant="outline" className="bg-success/10 text-success border-none text-[10px] font-bold">
                +12.5%
              </Badge>
              <span className="text-[10px] text-muted-foreground font-medium uppercase tracking-tight">vs bulan lalu</span>
            </div>
          </CardContent>
        </Card>

        <Card className="relative overflow-hidden border-none shadow-md bg-white">
          <div className="absolute top-0 left-0 h-full w-1.5 bg-danger" />
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-bold uppercase tracking-wider text-muted-foreground">Operational Cost</CardTitle>
            <TrendingDown className="h-4 w-4 text-danger" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatRupiah(28400000)}</div>
            <div className="flex items-center gap-1 mt-1">
              <Badge variant="outline" className="bg-danger/10 text-danger border-none text-[10px] font-bold">
                +4.2%
              </Badge>
              <span className="text-[10px] text-muted-foreground font-medium uppercase tracking-tight">vs bulan lalu</span>
            </div>
          </CardContent>
        </Card>

        <Card className="relative overflow-hidden border-none shadow-md bg-white">
          <div className="absolute top-0 left-0 h-full w-1.5 bg-info" />
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-bold uppercase tracking-wider text-muted-foreground">Net Profit Margin</CardTitle>
            <DollarSign className="h-4 w-4 text-info" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatPercent(37.2)}</div>
            <div className="flex items-center gap-1 mt-1">
              <Badge variant="outline" className="bg-info/10 text-info border-none text-[10px] font-bold">
                +2.1%
              </Badge>
              <span className="text-[10px] text-muted-foreground font-medium uppercase tracking-tight">vs bulan lalu</span>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card className="bg-muted/30 border-dashed">
          <CardHeader className="pb-2">
            <div className="flex items-center gap-2">
              <Wallet className="h-4 w-4 text-muted-foreground" />
              <CardTitle className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Cash on Hand</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-xl font-bold">{formatRupiah(8450000)}</div>
          </CardContent>
        </Card>
        <Card className="bg-muted/30 border-dashed">
          <CardHeader className="pb-2">
            <div className="flex items-center gap-2">
              <Building2 className="h-4 w-4 text-muted-foreground" />
              <CardTitle className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Bank Balance</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-xl font-bold">{formatRupiah(125800000)}</div>
          </CardContent>
        </Card>
        <Card className="bg-danger/5 border-danger/20 border-dashed">
          <CardHeader className="pb-2">
            <div className="flex items-center gap-2">
              <AlertCircle className="h-4 w-4 text-danger" />
              <CardTitle className="text-xs font-bold uppercase tracking-widest text-danger">Piutang Pelanggan</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-xl font-bold text-danger">{formatRupiah(3200000)}</div>
            <p className="text-[10px] text-danger/60 mt-1 font-medium">4 Pelanggan belum bayar</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Chart */}
      <Card className="border-none shadow-md">
        <CardHeader className="flex flex-row items-center justify-between">
          <div className="space-y-1">
            <CardTitle className="text-lg font-bold">Cashflow Forecast</CardTitle>
            <CardDescription>Perbandingan Pemasukan vs Pengeluaran & Prediksi 15 Hari ke Depan</CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" className="h-8 text-xs font-bold uppercase tracking-wider">Harian</Button>
            <Button variant="ghost" size="sm" className="h-8 text-xs font-bold uppercase tracking-wider text-muted-foreground">Mingguan</Button>
            <Button variant="ghost" size="sm" className="h-8 text-xs font-bold uppercase tracking-wider text-muted-foreground">Bulanan</Button>
          </div>
        </CardHeader>
        <CardContent className="pt-4">
          <div className="h-[350px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#008080" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#008080" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorExp" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#e11d48" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#e11d48" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis 
                  dataKey="name" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fontSize: 10, fill: '#94a3b8', fontWeight: 600 }}
                  dy={10}
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fontSize: 10, fill: '#94a3b8', fontWeight: 600 }}
                  tickFormatter={(value) => `Rp${value/1000000}jt`}
                />
                <Tooltip 
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)', fontSize: '12px' }}
                  formatter={(value: number) => [formatRupiah(value), '']}
                />
                <Area 
                  type="monotone" 
                  dataKey="revenue" 
                  stroke="#008080" 
                  strokeWidth={3}
                  fillOpacity={1} 
                  fill="url(#colorRev)" 
                  name="Pemasukan"
                />
                <Area 
                  type="monotone" 
                  dataKey="expenses" 
                  stroke="#e11d48" 
                  strokeWidth={3}
                  fillOpacity={1} 
                  fill="url(#colorExp)" 
                  name="Pengeluaran"
                />
                <Area 
                  type="monotone" 
                  dataKey="forecast" 
                  stroke="#008080" 
                  strokeWidth={2}
                  strokeDasharray="5 5"
                  fill="none" 
                  name="Prediksi"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="border-none shadow-md">
          <CardHeader>
            <CardTitle className="text-lg font-bold">Produk Margin Tertinggi</CardTitle>
            <CardDescription>Analisis kontribusi profit per produk</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {topProducts.map((product) => (
                <div key={product.name} className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-semibold">{product.name}</span>
                    <span className="font-bold text-primary">{product.margin}% Margin</span>
                  </div>
                  <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-primary transition-all duration-500" 
                      style={{ width: `${product.margin}%` }}
                    />
                  </div>
                  <div className="flex justify-between text-[10px] text-muted-foreground font-medium uppercase tracking-wider">
                    <span>{product.sales} Terjual</span>
                    <span>Target: 2500</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="border-none shadow-md bg-primary text-primary-foreground">
          <CardHeader>
            <CardTitle className="text-lg font-bold">Insight AI FinUMKM</CardTitle>
            <CardDescription className="text-primary-foreground/70">Rekomendasi otomatis untuk bisnis Anda</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-4 rounded-xl bg-white/10 backdrop-blur-sm border border-white/10">
              <div className="flex gap-3">
                <div className="h-8 w-8 rounded-lg bg-white/20 flex items-center justify-center shrink-0">
                  <TrendingUp className="h-4 w-4" />
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-semibold">Optimasi Stok Terdeteksi</p>
                  <p className="text-xs text-primary-foreground/80 leading-relaxed">
                    "Es Teh Kampul" memiliki margin 80% dan tren penjualan naik 15%. Pertimbangkan untuk menambah stok bahan baku sebelum akhir pekan.
                  </p>
                </div>
              </div>
            </div>
            <div className="p-4 rounded-xl bg-white/10 backdrop-blur-sm border border-white/10">
              <div className="flex gap-3">
                <div className="h-8 w-8 rounded-lg bg-white/20 flex items-center justify-center shrink-0">
                  <AlertCircle className="h-4 w-4" />
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-semibold">Peringatan Biaya Operasional</p>
                  <p className="text-xs text-primary-foreground/80 leading-relaxed">
                    Biaya "Bahan Baku" naik 8% minggu ini. Cek kembali supplier alternatif untuk menjaga margin profit Anda tetap di atas 35%.
                  </p>
                </div>
              </div>
            </div>
            <Button variant="secondary" className="w-full font-bold uppercase tracking-widest text-xs h-11">
              Lihat Analisis Lengkap
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
