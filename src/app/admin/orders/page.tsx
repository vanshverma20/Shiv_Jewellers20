import prisma from '@/lib/db';

export const dynamic = 'force-dynamic';

export default async function OrdersPage() {
    const orders = await prisma.order.findMany({
        include: { customer: true, items: true },
        orderBy: { createdAt: 'desc' },
    });

    return (
        <div>
            <div className="mb-8">
                <h1 className="text-3xl font-bold tracking-tight text-slate-900">Orders</h1>
                <p className="text-slate-500 text-sm mt-1">Review customer orders and payment status.</p>
            </div>
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead><tr className="bg-slate-50 border-b border-slate-200">
                        <th className="p-4 text-sm font-semibold text-slate-600">Customer</th>
                        <th className="p-4 text-sm font-semibold text-slate-600">Items</th>
                        <th className="p-4 text-sm font-semibold text-slate-600">Total</th>
                        <th className="p-4 text-sm font-semibold text-slate-600">Status</th>
                        <th className="p-4 text-sm font-semibold text-slate-600">Payment</th>
                        <th className="p-4 text-sm font-semibold text-slate-600">Date</th>
                    </tr></thead>
                    <tbody>
                        {orders.length === 0 ? <tr><td colSpan={6} className="p-12 text-center text-slate-500">No orders yet.</td></tr> : orders.map((order) => (
                            <tr key={order.id} className="border-b border-slate-100">
                                <td className="p-4"><div className="font-semibold text-slate-900">{order.customer.name}</div><div className="text-xs text-slate-400">{order.customer.email || order.customer.phone || 'No contact'}</div></td>
                                <td className="p-4 text-slate-600">{order.items.reduce((total, item) => total + item.quantity, 0)}</td>
                                <td className="p-4 font-semibold text-slate-700">₹{order.finalAmount.toLocaleString('en-IN')}</td>
                                <td className="p-4"><span className="rounded-full bg-amber-50 px-2.5 py-1 text-xs font-semibold text-amber-700">{order.status}</span></td>
                                <td className="p-4 text-sm text-slate-600">{order.paymentStatus}</td>
                                <td className="p-4 text-sm text-slate-500">{order.createdAt.toLocaleDateString('en-IN')}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
