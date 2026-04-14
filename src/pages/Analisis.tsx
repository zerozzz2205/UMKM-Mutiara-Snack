import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend
} from 'recharts'
import { formatRupiah, formatPercent } from "@/lib/format"
import { Badge } from "@/components/ui/badge"
import { TrendingUp, Target, Zap, PieChart as PieIcon, Info } from "lucide-react"
import { Button } from "@/components/ui/button"

const marginData = [
  { name: 'Minuman', margin: 68, revenue: 18500000 },
  { name: 'Makanan Berat', margin: 35, revenue: 12400000 },
  { name: 'Snack', margin: 52, revenue: 8200000 },
  { name: 'Merchandise', margin: 42, revenue: 6150000 },
]

const costBreakdown = [
  { name: 'Bahan Baku', value: 15400000, color: '#008080' },
  { name: 'Gaji Karyawan', value: 8500000, color: '#3b82f6' },
  { name: 'Sewa & Listrik', value: 3200000, color: '#f59e0b' },
  { name: 'Marketing', value: 1300000, color: '#e11d48' },
]

export default function Analisis() {
  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-1">
        <h1 className="text-3xl font-bold tracking-tight">Analisis Laba/Rugi</h1>
        <p className="text-muted-foreground">Pahami dari mana keuntungan Anda berasal dan bagaimana mengoptimalkannya.</p>
      </div>

      <div className="grid gap-6 md:grid-cols-12">
        {/* BEP Calculator Visualization */}
        <Card className="md:col-span-8 border-none shadow-md">
          <CardHeader className="flex flex-row items-center justify-between">
            <div className="space-y-1">
              <CardTitle className="text-lg font-bold">Break-even Point (BEP)</CardTitle>
              <CardDescription>Titik impas operasional bulan ini</CardDescription>
            </div>
            <Badge variant="outline" className="bg-primary/10 text-primary border-none font-bold">TERCAPAI</Badge>
          </CardHeader>
          <CardContent className="pt-4">
            <div className="relative h-24 w-full bg-muted rounded-2xl overflow-hidden mb-8">
              <div className="absolute inset-0 flex items-center px-8 justify-between z-10">
                <div className="flex flex-col">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Fixed Cost</span>
                  <span className="text-sm font-bold">{formatRupiah(11700000)}</span>
                </div>
                <div className="flex flex-col items-center">
                  <div className="h-12 w-[2px] bg-primary/30 mb-1" />
                  <span className="text-[10px] font-bold uppercase tracking-widest text-primary">BEP Target</span>
                  <span className="text-sm font-bold text-primary">{formatRupiah(24500000)}</span>
                </div>
                <div className="flex flex-col items-end">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Current Sales</span>
                  <span className="text-sm font-bold text-success">{formatRupiah(45250000)}</span>
                </div>
              </div>
              <div 
                className="absolute top-0 left-0 h-full bg-success/20 transition-all duration-1000" 
                style={{ width: '100%' }}
              />
              <div 
                className="absolute top-0 left-0 h-full bg-primary/10 transition-all duration-1000" 
                style={{ width: '54%' }}
              />
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="p-4 rounded-xl bg-muted/30 border border-dashed text-center">
                <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-1">Margin Kontribusi</p>
                <p className="text-lg font-bold">48.5%</p>
              </div>
              <div className="p-4 rounded-xl bg-muted/30 border border-dashed text-center">
                <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-1">Unit BEP</p>
                <p className="text-lg font-bold">842 Cup</p>
              </div>
              <div className="p-4 rounded-xl bg-muted/30 border border-dashed text-center">
                <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-1">Safety Margin</p>
                <p className="text-lg font-bold text-success">45.8%</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Cost Breakdown */}
        <Card className="md:col-span-4 border-none shadow-md">
          <CardHeader>
            <CardTitle className="text-lg font-bold">Struktur Biaya</CardTitle>
            <CardDescription>Alokasi pengeluaran operasional</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[200px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={costBreakdown}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {costBreakdown.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value: number) => formatRupiah(value)} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="space-y-2 mt-4">
              {costBreakdown.map((item) => (
                <div key={item.name} className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <div className="h-2 w-2 rounded-full" style={{ backgroundColor: item.color }} />
                    <span className="font-medium text-muted-foreground">{item.name}</span>
                  </div>
                  <span className="font-bold">{formatPercent((item.value / 28400000) * 100)}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Margin Analysis Heatmap Style */}
      <Card className="border-none shadow-md">
        <CardHeader>
          <CardTitle className="text-lg font-bold">Analisis Margin per Kategori</CardTitle>
          <CardDescription>Visualisasi kontribusi profit vs volume penjualan</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[350px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={marginData} layout="vertical" margin={{ top: 5, right: 30, left: 40, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f1f5f9" />
                <XAxis type="number" hide />
                <YAxis 
                  dataKey="name" 
                  type="category" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fontSize: 12, fontWeight: 600, fill: '#64748b' }}
                />
                <Tooltip 
                  cursor={{ fill: '#f8fafc' }}
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                  formatter={(value: number, name: string) => [name === 'margin' ? `${value}%` : formatRupiah(value), name === 'margin' ? 'Profit Margin' : 'Total Revenue']}
                />
                <Bar dataKey="revenue" fill="#008080" radius={[0, 4, 4, 0]} barSize={20} name="Revenue" />
                <Bar dataKey="margin" fill="#3b82f6" radius={[0, 4, 4, 0]} barSize={20} name="Margin" />
              </BarChart>
            </ResponsiveContainer>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
            <div className="p-6 rounded-2xl bg-success/5 border border-success/10 flex gap-4">
              <div className="h-12 w-12 rounded-xl bg-success/10 flex items-center justify-center shrink-0">
                <TrendingUp className="h-6 w-6 text-success" />
              </div>
              <div className="space-y-1">
                <p className="text-sm font-bold text-success uppercase tracking-tight">Potensi Profit</p>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Kategori <strong>Minuman</strong> memiliki margin tertinggi (68%). Fokuskan promosi "Buy 1 Get 1" pada kategori ini untuk memaksimalkan omzet tanpa menggerus profit terlalu dalam.
                </p>
              </div>
            </div>
            <div className="p-6 rounded-2xl bg-info/5 border border-info/10 flex gap-4">
              <div className="h-12 w-12 rounded-xl bg-info/10 flex items-center justify-center shrink-0">
                <Zap className="h-6 w-6 text-info" />
              </div>
              <div className="space-y-1">
                <p className="text-sm font-bold text-info uppercase tracking-tight">Efisiensi Biaya</p>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Biaya <strong>Bahan Baku</strong> menyerap 54% dari total pengeluaran. Melakukan bulk-buying untuk item non-perishable dapat meningkatkan margin keseluruhan sebesar 3-5%.
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
