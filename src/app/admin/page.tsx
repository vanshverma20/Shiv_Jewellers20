import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/db";
import { DashboardStats } from "@/components/admin/DashboardStats";

export default async function AdminDashboard() {
  const session = await getServerSession(authOptions);

  const [productsCount, ordersCount, inventoryCount] = await Promise.all([
    prisma.product.count(),
    prisma.order.count(),
    prisma.inventory.aggregate({ _sum: { stockQuantity: true } })
  ]);
  
  // Dummy scan data for demo
  const chartData = [
    { name: 'Mon', scans: 40, sales: 2400 },
    { name: 'Tue', scans: 30, sales: 1398 },
    { name: 'Wed', scans: 20, sales: 9800 },
    { name: 'Thu', scans: 27, sales: 3908 },
    { name: 'Fri', scans: 18, sales: 4800 },
    { name: 'Sat', scans: 23, sales: 3800 },
    { name: 'Sun', scans: 34, sales: 4300 },
  ];

  return (
    <div>
      <h1 className="text-3xl font-bold tracking-tight text-slate-900 mb-6">Dashboard</h1>
      <DashboardStats 
        productsCount={productsCount} 
        ordersCount={ordersCount} 
        inventoryCount={inventoryCount._sum.stockQuantity || 0}
        chartData={chartData}
      />
    </div>
  );
}
