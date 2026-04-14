import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"
import { Store, User, Bell, Shield, Wallet, Globe, Moon, Sun } from "lucide-react"

export default function Settings() {
  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-1">
        <h1 className="text-3xl font-bold tracking-tight">Pengaturan</h1>
        <p className="text-muted-foreground">Kelola profil toko, preferensi aplikasi, dan keamanan data Anda.</p>
      </div>

      <Tabs defaultValue="toko" className="space-y-6">
        <TabsList className="bg-muted/50 p-1 h-12 gap-1">
          <TabsTrigger value="toko" className="data-[state=active]:bg-white data-[state=active]:shadow-sm font-bold text-xs uppercase tracking-widest px-6">
            Profil Toko
          </TabsTrigger>
          <TabsTrigger value="akun" className="data-[state=active]:bg-white data-[state=active]:shadow-sm font-bold text-xs uppercase tracking-widest px-6">
            Akun Pengguna
          </TabsTrigger>
          <TabsTrigger value="notifikasi" className="data-[state=active]:bg-white data-[state=active]:shadow-sm font-bold text-xs uppercase tracking-widest px-6">
            Notifikasi
          </TabsTrigger>
          <TabsTrigger value="keamanan" className="data-[state=active]:bg-white data-[state=active]:shadow-sm font-bold text-xs uppercase tracking-widest px-6">
            Keamanan
          </TabsTrigger>
        </TabsList>

        <TabsContent value="toko" className="space-y-6">
          <Card className="border-none shadow-md">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center">
                  <Store className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <CardTitle className="text-lg font-bold">Informasi Bisnis</CardTitle>
                  <CardDescription>Detail publik toko UMKM Anda</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Nama Toko</label>
                  <Input defaultValue="Kopi Kadek & Eatery" className="h-11 bg-muted/20 border-none" />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Kategori Bisnis</label>
                  <Input defaultValue="Food & Beverage" className="h-11 bg-muted/20 border-none" />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Email Bisnis</label>
                  <Input defaultValue="hello@kopikadek.com" className="h-11 bg-muted/20 border-none" />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Nomor WhatsApp</label>
                  <Input defaultValue="+62 812 3456 7890" className="h-11 bg-muted/20 border-none" />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Alamat Lengkap</label>
                <Input defaultValue="Jl. Melati No. 45, Denpasar, Bali" className="h-11 bg-muted/20 border-none" />
              </div>
              <div className="flex justify-end">
                <Button className="font-bold uppercase tracking-widest text-xs h-11 px-8">Simpan Perubahan</Button>
              </div>
            </CardContent>
          </Card>

          <Card className="border-none shadow-md">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-xl bg-info/10 flex items-center justify-center">
                  <Wallet className="h-5 w-5 text-info" />
                </div>
                <div>
                  <CardTitle className="text-lg font-bold">Preferensi Mata Uang & Pajak</CardTitle>
                  <CardDescription>Atur format keuangan aplikasi</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Mata Uang Utama</label>
                  <div className="h-11 bg-muted/20 rounded-md flex items-center px-3 text-sm font-medium">IDR - Rupiah Indonesia</div>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Persentase PPN (%)</label>
                  <Input defaultValue="11" type="number" className="h-11 bg-muted/20 border-none" />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="akun">
          <Card className="border-none shadow-md">
            <CardHeader>
              <CardTitle className="text-lg font-bold">Profil Pengguna</CardTitle>
              <CardDescription>Kelola informasi login Anda</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center gap-6">
                <div className="h-24 w-24 rounded-full bg-muted flex items-center justify-center text-2xl font-bold">K</div>
                <div className="space-y-2">
                  <Button variant="outline" size="sm" className="font-bold uppercase tracking-widest text-[10px]">Ganti Foto</Button>
                  <p className="text-xs text-muted-foreground">JPG, PNG atau GIF. Maksimal 2MB.</p>
                </div>
              </div>
              <Separator />
              <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Nama Lengkap</label>
                  <Input defaultValue="Muhammad Kadek Fajri" className="h-11 bg-muted/20 border-none" />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Role</label>
                  <Input defaultValue="Owner / Admin Utama" disabled className="h-11 bg-muted/10 border-none opacity-60" />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
