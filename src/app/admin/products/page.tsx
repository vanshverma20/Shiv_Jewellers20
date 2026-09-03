import Link from 'next/link';
import { Plus } from 'lucide-react';
import prisma from '@/lib/db';
import { DeleteProductButton } from '@/components/admin/DeleteProductButton';

export const dynamic = 'force-dynamic';

export default async function ProductsAdminPage({ searchParams }: { searchParams: Promise<{ q?: string; status?: string }> }) {
  const filters = await searchParams;
  const query = filters.q?.trim() || '';
  const products = await prisma.product.findMany({
    where: {
      ...(filters.status && filters.status !== 'ALL' ? { status: filters.status as any } : {}),
      ...(query ? {
        OR: [
          { name: { contains: query } },
          { publicId: { contains: query } },
          { sku: { contains: query } },
        ]
      } : {}),
    },
    include: { pricing: true, inventory: true, category: true, qrCode: true },
    orderBy: { createdAt: 'desc' }
  });

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">Products</h1>
          <p className="text-slate-500 text-sm mt-1">{products.length} product{products.length !== 1 ? 's' : ''} total</p>
        </div>
        <Link
          href="/admin/products/new"
          className="bg-amber-600 hover:bg-amber-700 text-white px-4 py-2 rounded-md font-medium flex items-center gap-2 transition-colors shadow-sm"
        >
          <Plus size={20} /> Add Product
        </Link>
      </div>

      <form className="flex flex-col sm:flex-row gap-3 mb-5" action="/admin/products">
        <input name="q" defaultValue={query} placeholder="Search name, Product ID or SKU" className="flex-1 rounded-md border border-slate-300 bg-white px-3 py-2.5 text-sm outline-none focus:border-amber-500" />
        <select name="status" defaultValue={filters.status || 'ALL'} className="rounded-md border border-slate-300 bg-white px-3 py-2.5 text-sm">
          <option value="ALL">All statuses</option><option value="ACTIVE">Active</option><option value="DRAFT">Draft</option><option value="ARCHIVED">Archived</option>
        </select>
        <button type="submit" className="rounded-md bg-slate-900 px-5 py-2.5 text-sm font-medium text-white">Search</button>
      </form>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200">
                <th className="p-4 font-semibold text-slate-600 text-sm">Product</th>
                <th className="p-4 font-semibold text-slate-600 text-sm">Product ID / SKU</th>
                <th className="p-4 font-semibold text-slate-600 text-sm">Status</th>
                <th className="p-4 font-semibold text-slate-600 text-sm">Price</th>
                <th className="p-4 font-semibold text-slate-600 text-sm">Stock</th>
                <th className="p-4 font-semibold text-slate-600 text-sm">QR Code</th>
                <th className="p-4 font-semibold text-slate-600 text-sm text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-12 text-center">
                    <div className="flex flex-col items-center gap-3 text-slate-400">
                      <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center text-2xl">📦</div>
                      <p className="font-medium text-slate-500">No products yet</p>
                      <Link href="/admin/products/new" className="text-amber-600 hover:text-amber-700 text-sm font-medium">
                        + Add your first product
                      </Link>
                    </div>
                  </td>
                </tr>
              ) : products.map((p) => (
                <tr key={p.id} className="border-b border-slate-100 hover:bg-slate-50/70 transition-colors">
                  <td className="p-4">
                    <div className="font-semibold text-slate-900">{p.name}</div>
                    <div className="text-xs text-slate-400 font-mono mt-0.5">{p.publicId} · {p.sku}</div>
                    <div className="text-xs text-slate-400 mt-0.5">{p.category.name}</div>
                  </td>
                  <td className="p-4 text-xs font-mono text-slate-500">{p.publicId}<br />{p.sku}</td>
                  <td className="p-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${p.status === 'ACTIVE'
                      ? 'bg-green-100 text-green-800'
                      : p.status === 'ARCHIVED'
                        ? 'bg-slate-100 text-slate-500'
                        : 'bg-yellow-100 text-yellow-800'
                      }`}>
                      {p.status}
                    </span>
                  </td>
                  <td className="p-4 font-medium text-slate-700">
                    ₹{p.pricing?.finalSellingPrice?.toLocaleString('en-IN') || '—'}
                  </td>
                  <td className="p-4">
                    <span className={`text-sm font-medium ${(p.inventory?.availableQuantity || 0) <= 2 ? 'text-red-500' : 'text-slate-600'}`}>
                      {p.inventory?.availableQuantity ?? 0} in stock
                    </span>
                  </td>
                  <td className="p-4">
                    <div className="flex flex-col gap-2 items-start">
                      {p.qrCode ? (
                        <a
                          href={p.qrCode.qrData}
                          download={`QR-${p.publicId}.png`}
                          className="inline-flex items-center gap-1 text-xs text-amber-600 hover:text-amber-700 font-medium border border-amber-200 rounded px-2 py-1 bg-amber-50 hover:bg-amber-100 transition-colors"
                          title="Download QR Code"
                        >
                          ⬇ QR Code
                        </a>
                      ) : (
                        <span className="text-xs text-slate-400">No QR</span>
                      )}

                      {p.qrCode?.barcodeData && (
                        <a
                          href={p.qrCode.barcodeData}
                          download={`BARCODE-${p.publicId}.png`}
                          className="inline-flex items-center gap-1 text-xs text-slate-600 hover:text-slate-700 font-medium border border-slate-200 rounded px-2 py-1 bg-slate-50 hover:bg-slate-100 transition-colors"
                          title="Download Barcode"
                        >
                          ⬇ Barcode
                        </a>
                      )}
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center justify-end gap-4">
                      <Link
                        href={`/scan/${p.publicId}`}
                        target="_blank"
                        className="text-slate-500 hover:text-slate-800 font-medium text-sm transition-colors"
                      >
                        Preview
                      </Link>
                      <DeleteProductButton productId={p.id} productName={p.name} />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
