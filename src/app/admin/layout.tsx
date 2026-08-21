import { Sidebar } from "@/components/admin/Sidebar";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";

export const metadata = {
  title: "Admin Panel | JWL Commerce",
}

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/admin-login");
  }

  return (
    <div className="flex min-h-screen bg-slate-100 text-slate-900">
      <Sidebar />
      <main className="flex-1 p-8 overflow-y-auto h-screen">
        {children}
      </main>
    </div>
  );
}
