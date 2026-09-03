import prisma from '@/lib/db';

export const dynamic = 'force-dynamic';

export default async function InventoryPage() {
    const inventory = await prisma.inventory.findMany({
        include: { product: { select: { name: true, sku: true, publicId: true, category: true } } },
        orderBy: { product: { name: 'asc' } },
    });

    return (
        <div>
            <div className="mb-8">
                <h1 className="text-3xl font-bold tracking-tight text-slate-900">Inventory</h1>
                <p className="text-slate-500 text-sm mt-1">Monitor stock levels and showroom locations.</p>
            </div>
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead><tr className="bg-slate-50 border-b border-slate-200">
                        <th className="p-4 text-sm font-semibold text-slate-600">Product</th>
                        <th className="p-4 text-sm font-semibold text-slate-600">Product ID</th>
                        <th className="p-4 text-sm font-semibold text-slate-600">Available</th>
                        <th className="p-4 text-sm font-semibold text-slate-600">Reserved</th>
                        <th className="p-4 text-sm font-semibold text-slate-600">Location</th>
                    </tr></thead>
                    <tbody>
                        {inventory.length === 0 ? <tr><td colSpan={5} className="p-12 text-center text-slate-500">No inventory records yet.</td></tr> : inventory.map((item) => (
                            <tr key={item.id} className="border-b border-slate-100">
                                <td className="p-4"><div className="font-semibold text-slate-900">{item.product.name}</div><div className="text-xs text-slate-400">{item.product.sku}</div></td>
                                <td className="p-4 text-xs font-mono text-slate-500">{item.product.publicId}</td>
                                <td className={`p-4 font-semibold ${item.availableQuantity <= item.reorderThreshold ? 'text-red-600' : 'text-emerald-600'}`}>{item.availableQuantity}</td>
                                <td className="p-4 text-slate-600">{item.reservedQuantity}</td>
                                <td className="p-4 text-slate-600">{item.warehouseLoc || 'Not assigned'}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
