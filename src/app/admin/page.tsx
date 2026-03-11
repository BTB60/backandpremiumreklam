"use client";

import { Header } from "@/components/layout/Header";
import { MobileNav } from "@/components/layout/MobileNav";
import { Button } from "@/components/ui/Button";
import { Card, StatCard, OrderCard } from "@/components/ui/Card";
import { 
  TrendingUp, 
  Users, 
  ShoppingCart, 
  DollarSign,
  AlertCircle,
  CheckCircle,
  Clock,
  MoreHorizontal,
  ArrowUpRight,
  ArrowDownRight
} from "lucide-react";
import { motion } from "framer-motion";

// Activity Log Item
function ActivityItem({ icon, title, description, time, type }: { 
  icon: React.ReactNode; 
  title: string; 
  description: string; 
  time: string;
  type: "success" | "warning" | "info";
}) {
  const colors = {
    success: "bg-[#16A34A]/10 text-[#16A34A]",
    warning: "bg-[#F59E0B]/10 text-[#F59E0B]",
    info: "bg-[#3B82F6]/10 text-[#3B82F6]",
  };

  return (
    <div className="flex items-start gap-3 p-3 rounded-xl hover:bg-gray-50 transition-colors">
      <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${colors[type]}`}>
        {icon}
      </div>
      <div className="flex-1 min-w-0">
        <p className="font-medium text-[#1F2937] text-sm">{title}</p>
        <p className="text-xs text-[#6B7280] mt-0.5">{description}</p>
      </div>
      <span className="text-xs text-[#6B7280] whitespace-nowrap">{time}</span>
    </div>
  );
}

// Pending User Card
function PendingUserCard({ name, email, date, avatar }: { 
  name: string; 
  email: string; 
  date: string;
  avatar: string;
}) {
  return (
    <div className="flex items-center gap-3 p-3 rounded-xl border border-[#E5E7EB] bg-white">
      <div className="w-10 h-10 rounded-full bg-[#D90429]/10 flex items-center justify-center text-[#D90429] font-bold">
        {avatar}
      </div>
      <div className="flex-1 min-w-0">
        <p className="font-medium text-[#1F2937] text-sm truncate">{name}</p>
        <p className="text-xs text-[#6B7280] truncate">{email}</p>
      </div>
      <div className="flex gap-2">
        <button className="w-8 h-8 rounded-lg bg-[#16A34A]/10 text-[#16A34A] flex items-center justify-center hover:bg-[#16A34A] hover:text-white transition-colors">
          <CheckCircle className="w-4 h-4" />
        </button>
        <button className="w-8 h-8 rounded-lg bg-[#DC2626]/10 text-[#DC2626] flex items-center justify-center hover:bg-[#DC2626] hover:text-white transition-colors">
          <AlertCircle className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}

// Top Product Card
function TopProductCard({ name, sales, revenue, trend }: { 
  name: string; 
  sales: number; 
  revenue: number;
  trend: "up" | "down";
}) {
  return (
    <div className="flex items-center gap-3 p-3 rounded-xl border border-[#E5E7EB] bg-white">
      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#D90429]/20 to-[#EF476F]/20 flex items-center justify-center">
        <ShoppingCart className="w-6 h-6 text-[#D90429]" />
      </div>
      <div className="flex-1">
        <p className="font-medium text-[#1F2937] text-sm">{name}</p>
        <p className="text-xs text-[#6B7280]">{sales} satış</p>
      </div>
      <div className="text-right">
        <p className="font-semibold text-[#1F2937] text-sm">{revenue} AZN</p>
        <div className={`flex items-center gap-1 text-xs ${trend === "up" ? "text-[#16A34A]" : "text-[#DC2626]"}`}>
          {trend === "up" ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
          <span>12%</span>
        </div>
      </div>
    </div>
  );
}

// Simple Chart Component
function SimpleChart() {
  const data = [40, 65, 45, 80, 55, 90, 70];
  const maxValue = Math.max(...data);

  return (
    <div className="h-48 flex items-end gap-2">
      {data.map((value, index) => (
        <motion.div
          key={index}
          initial={{ height: 0 }}
          animate={{ height: `${(value / maxValue) * 100}%` }}
          transition={{ duration: 0.5, delay: index * 0.1 }}
          className="flex-1 bg-gradient-to-t from-[#D90429] to-[#EF476F] rounded-t-lg opacity-80 hover:opacity-100 transition-opacity cursor-pointer"
        />
      ))}
    </div>
  );
}

export default function AdminDashboard() {
  const recentOrders = [
    { orderNumber: "#ORD-2024-001", customer: "Aygün Məmmədova", date: "09.03.2024", amount: 450, status: "completed" as const },
    { orderNumber: "#ORD-2024-002", customer: "Rəşid Əliyev", date: "08.03.2024", amount: 320, status: "processing" as const },
    { orderNumber: "#ORD-2024-003", customer: "Nigar Həsənli", date: "07.03.2024", amount: 580, status: "pending" as const },
    { orderNumber: "#ORD-2024-004", customer: "Tural Əhmədov", date: "06.03.2024", amount: 290, status: "completed" as const },
  ];

  const pendingUsers = [
    { name: "Leyla Hüseynova", email: "leyla@example.com", date: "Bugün", avatar: "L" },
    { name: "Kamil İsmayılov", email: "kamil@example.com", date: "Dünən", avatar: "K" },
    { name: "Sara Quliyeva", email: "sara@example.com", date: "2 gün əvvəl", avatar: "S" },
  ];

  const topProducts = [
    { name: "Premium Pərdə", sales: 124, revenue: 18600, trend: "up" as const },
    { name: "Jalüz Sistemləri", sales: 98, revenue: 14700, trend: "up" as const },
    { name: "Wallpaper", sales: 76, revenue: 7600, trend: "down" as const },
  ];

  return (
    <main className="min-h-screen bg-[#F8F9FB] pb-24 md:pb-8">
      <Header variant="admin" userName="Admin" notifications={5} />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Title */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl lg:text-3xl font-bold text-[#1F2937] font-[Manrope]">
              Admin Dashboard
            </h1>
            <p className="text-[#6B7280] mt-1">Platformun ümumi statistikası</p>
          </div>
          <div className="flex gap-3">
            <Button variant="secondary" size="sm">Hesabat Yüklə</Button>
            <Button size="sm">Yeni Sifariş</Button>
          </div>
        </div>

        {/* KPI Stats */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 mb-8">
          <StatCard
            title="Bugünkü Gəlir"
            value="3,240 AZN"
            change="+8%"
            changeType="positive"
            icon={<DollarSign className="w-5 h-5" />}
          />
          <StatCard
            title="Bu Həftə"
            value="42"
            change="+12%"
            changeType="positive"
            icon={<ShoppingCart className="w-5 h-5" />}
          />
          <StatCard
            title="Aktiv Dekorçu"
            value="28"
            change="+3"
            changeType="positive"
            icon={<Users className="w-5 h-5" />}
          />
          <StatCard
            title="Gözləyən"
            value="5"
            change="Təsdiq gözləyir"
            changeType="warning"
            icon={<Clock className="w-5 h-5" />}
          />
          <StatCard
            title="Ödənilməmiş"
            value="1,850"
            change="AZN"
            changeType="negative"
            icon={<AlertCircle className="w-5 h-5" />}
          />
          <StatCard
            title="Top Məhsul"
            value="Pərdə"
            change="124 satış"
            changeType="positive"
            icon={<TrendingUp className="w-5 h-5" />}
          />
        </div>

        {/* Main Content Grid */}
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Left Column - 2/3 */}
          <div className="lg:col-span-2 space-y-6">
            {/* Revenue Chart */}
            <Card>
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="font-bold text-[#1F2937] font-[Manrope]">Gəlir Analitikası</h3>
                  <p className="text-sm text-[#6B7280]">Son 7 gün</p>
                </div>
                <select className="h-9 px-3 rounded-lg border border-[#E5E7EB] text-sm bg-white">
                  <option>Son 7 gün</option>
                  <option>Son 30 gün</option>
                  <option>Bu il</option>
                </select>
              </div>
              <SimpleChart />
              <div className="flex justify-between mt-4 text-xs text-[#6B7280]">
                <span>Mon</span>
                <span>Tue</span>
                <span>Wed</span>
                <span>Thu</span>
                <span>Fri</span>
                <span>Sat</span>
                <span>Sun</span>
              </div>
            </Card>

            {/* Recent Orders */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-[#1F2937] font-[Manrope]">Son Sifarişlər</h2>
                <Button variant="ghost" size="sm">Hamısına Bax</Button>
              </div>
              <div className="space-y-3">
                {recentOrders.map((order, index) => (
                  <OrderCard key={index} {...order} />
                ))}
              </div>
            </div>
          </div>

          {/* Right Column - 1/3 */}
          <div className="space-y-6">
            {/* Pending Users */}
            <Card>
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-[#1F2937] font-[Manrope]">Təsdiq Gözləyənlər</h3>
                <span className="w-5 h-5 bg-[#F59E0B] text-white text-xs rounded-full flex items-center justify-center">
                  {pendingUsers.length}
                </span>
              </div>
              <div className="space-y-3">
                {pendingUsers.map((user, index) => (
                  <PendingUserCard key={index} {...user} />
                ))}
              </div>
              <Button variant="ghost" className="w-full mt-4">
                Hamısına Bax
              </Button>
            </Card>

            {/* Top Products */}
            <Card>
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-[#1F2937] font-[Manrope]">Top Məhsullar</h3>
                <Button variant="ghost" size="sm">
                  <MoreHorizontal className="w-4 h-4" />
                </Button>
              </div>
              <div className="space-y-3">
                {topProducts.map((product, index) => (
                  <TopProductCard key={index} {...product} />
                ))}
              </div>
            </Card>

            {/* Activity Log */}
            <Card>
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-[#1F2937] font-[Manrope]">Son Aktivlik</h3>
                <Button variant="ghost" size="sm">Hamısı</Button>
              </div>
              <div className="space-y-1">
                <ActivityItem
                  icon={<ShoppingCart className="w-4 h-4" />}
                  title="Yeni Sifariş"
                  description="#ORD-2024-005 yaradıldı"
                  time="5 dəq"
                  type="success"
                />
                <ActivityItem
                  icon={<Users className="w-4 h-4" />}
                  title="Yeni İstifadəçi"
                  description="Leyla Hüseynova qeydiyyatdan keçdi"
                  time="15 dəq"
                  type="info"
                />
                <ActivityItem
                  icon={<DollarSign className="w-4 h-4" />}
                  title="Ödəniş Alındı"
                  description="450 AZN ödəniş təsdiqləndi"
                  time="1 saat"
                  type="success"
                />
                <ActivityItem
                  icon={<AlertCircle className="w-4 h-4" />}
                  title="Borc Xatırlatması"
                  description="Əli Vəliyev - 450 AZN"
                  time="2 saat"
                  type="warning"
                />
              </div>
            </Card>
          </div>
        </div>
      </div>

      <MobileNav variant="admin" />
    </main>
  );
}
