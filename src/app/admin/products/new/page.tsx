import { ProductForm } from "@/components/admin/ProductForm";
import prisma from "@/lib/db";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default async function NewProductPage() {
  const categories = await prisma.category.findMany({ orderBy: { name: 'asc' } });
  
  return (
    <div className="max-w-4xl mx-auto pb-12">
      <div className="mb-6">
        <Link href="/admin/products" className="inline-flex items-center text-sm font-medium text-slate-500 hover:text-slate-800 transition-colors">
          <ArrowLeft size={16} className="mr-1" /> Back to Products
        </Link>
      </div>
      
      <div className="mb-8 border-b border-slate-200 pb-5">
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">Add New Product</h1>
        <p className="text-slate-500 mt-2">Fill out the information below to create a new product and generate its QR code.</p>
      </div>

      <ProductForm categories={categories} />
    </div>
  );
}
