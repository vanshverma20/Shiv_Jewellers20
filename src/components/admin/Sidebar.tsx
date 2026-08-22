"use client";
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, Package, QrCode, ClipboardList, Users } from 'lucide-react';
import { cn } from '@/lib/utils';

export function Sidebar() {
  const pathname = usePathname();
  
  const links = [
    { name: 'Dashboard', href: '/admin', icon: LayoutDashboard },
    { name: 'Products', href: '/admin/products', icon: Package },
    { name: 'Inventory', href: '/admin/inventory', icon: ClipboardList },
    { name: 'Orders', href: '/admin/orders', icon: ClipboardList },
    { name: 'Customers', href: '/admin/customers', icon: Users },
  ];

  return (
    <div className="w-64 bg-slate-900 border-r border-slate-800 min-h-screen text-slate-100 p-4">
      <div className="mb-8 p-2">
        <h1 className="text-lg font-bold tracking-tight text-white flex items-center gap-2">
          <QrCode className="text-amber-500" size={20} /> Shiv Jewellers
        </h1>
        <p className="text-[10px] text-slate-500 tracking-wider uppercase mt-0.5 ml-7">Admin Panel</p>
      </div>
      <nav className="space-y-1">
        {links.map(link => {
          const isActive = pathname === link.href || (pathname.startsWith(link.href) && link.href !== '/admin');
          return (
            <Link 
              key={link.name} 
              href={link.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium transition-colors hover:bg-slate-800 hover:text-white",
                isActive ? "bg-slate-800 text-white border-l-2 border-amber-500" : "text-slate-400"
              )}
            >
              <link.icon size={18} />
              {link.name}
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
