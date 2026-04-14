import * as React from "react"
import {
  LayoutDashboard,
  BookOpen,
  TrendingUp,
  Package,
  FileText,
  Settings,
  ChevronRight,
  Store,
} from "lucide-react"
import { Link, useLocation } from "react-router-dom"

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarGroup,
  SidebarGroupLabel,
} from "@/components/ui/sidebar"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"

const items = [
  {
    title: "Dashboard",
    url: "/",
    icon: LayoutDashboard,
  },
  {
    title: "Buku Kas Utama",
    url: "/buku-kas",
    icon: BookOpen,
  },
  {
    title: "Analisis Laba/Rugi",
    url: "/analisis",
    icon: TrendingUp,
  },
  {
    title: "Manajemen Stok",
    url: "/inventory",
    icon: Package,
  },
  {
    title: "Laporan Export",
    url: "/reports",
    icon: FileText,
  },
  {
    title: "Pengaturan",
    url: "/settings",
    icon: Settings,
  },
]

export function AppSidebar() {
  const location = useLocation()

  return (
    <Sidebar collapsible="icon" className="border-r-0">
      <SidebarHeader className="h-16 flex items-center px-6 border-b border-sidebar-border/50">
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <Store className="h-5 w-5" />
          </div>
          <div className="flex flex-col gap-0.5 leading-none group-data-[collapsible=icon]:hidden">
            <span className="font-bold text-lg tracking-tight">FinUMKM</span>
            <span className="text-[10px] text-sidebar-foreground/60 uppercase tracking-widest font-semibold">Enterprise</span>
          </div>
        </div>
      </SidebarHeader>
      <SidebarContent className="py-4">
        <SidebarGroup>
          <SidebarGroupLabel className="px-6 text-xs font-bold uppercase tracking-widest text-sidebar-foreground/40 mb-2 group-data-[collapsible=icon]:hidden">
            Menu Utama
          </SidebarGroupLabel>
          <SidebarMenu className="px-3 gap-1">
            {items.map((item) => {
              const isActive = location.pathname === item.url
              return (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    isActive={isActive}
                    tooltip={item.title}
                    className={`h-11 px-3 transition-all duration-200 ${
                      isActive 
                        ? "bg-primary/10 text-primary font-semibold shadow-[inset_3px_0_0_0_#008080]" 
                        : "hover:bg-sidebar-accent/50 text-sidebar-foreground/70 hover:text-sidebar-foreground"
                    }`}
                  >
                    <Link to={item.url}>
                      <item.icon className={`h-5 w-5 ${isActive ? "text-primary" : ""}`} />
                      <span className="group-data-[collapsible=icon]:hidden">{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              )
            })}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="p-4 border-t border-sidebar-border/50">
        <div className="flex items-center gap-3 px-2 group-data-[collapsible=icon]:hidden">
          <div className="h-8 w-8 rounded-full bg-sidebar-accent flex items-center justify-center text-xs font-bold">
            K
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-medium">Kadek - Owner</span>
            <span className="text-[10px] text-sidebar-foreground/50">Admin Utama</span>
          </div>
        </div>
      </SidebarFooter>
    </Sidebar>
  )
}
