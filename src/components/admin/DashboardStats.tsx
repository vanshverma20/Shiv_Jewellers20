"use client";
import { Package, ShoppingCart, Archive, TrendingUp } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export function DashboardStats({ productsCount, ordersCount, inventoryCount, chartData }: any) {
  const stats = [
    { title: "Total Products", value: productsCount, icon: Package, color: "text-blue-500" },
    { title: "Total Orders", value: ordersCount, icon: ShoppingCart, color: "text-green-500" },
    { title: "Inventory Items", value: inventoryCount, icon: Archive, color: "text-amber-500" },
    { title: "Total Scans", value: 192, icon: TrendingUp, color: "text-purple-500" },
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <div key={i} className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-500">{stat.title}</p>
              <h3 className="text-2xl font-bold text-slate-900 mt-1">{stat.value}</h3>
            </div>
            <div className={`p-3 rounded-full bg-slate-50 ${stat.color}`}>
              <stat.icon size={24} />
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm mt-6">
        <h3 className="text-lg font-bold text-slate-900 mb-4">Weekly Performance</h3>
        <div className="h-80 w-full text-sm">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
              <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748b'}} />
              <YAxis yAxisId="left" orientation="left" stroke="#64748b" axisLine={false} tickLine={false} />
              <YAxis yAxisId="right" orientation="right" stroke="#f59e0b" axisLine={false} tickLine={false} />
              <Tooltip 
                cursor={{fill: '#f8fafc'}}
                contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)'}}
              />
              <Bar yAxisId="left" dataKey="sales" name="Sales ($)" fill="#0f172a" radius={[4, 4, 0, 0]} barSize={20} />
              <Bar yAxisId="right" dataKey="scans" name="QR Scans" fill="#f59e0b" radius={[4, 4, 0, 0]} barSize={20} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
