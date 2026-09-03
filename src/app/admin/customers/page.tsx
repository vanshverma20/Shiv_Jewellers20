import prisma from '@/lib/db';

export const dynamic = 'force-dynamic';

export default async function CustomersPage() {
    const customers = await prisma.customer.findMany({
        include: { _count: { select: { orders: true } } },
        orderBy: { createdAt: 'desc' },
    });

    return (
        <div>
            <div className="mb-8">
                <h1 className="text-3xl font-bold tracking-tight text-slate-900">Customers</h1>
                <p className="text-slate-500 text-sm mt-1">View customer contacts and order history.</p>
            </div>
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead><tr className="bg-slate-50 border-b border-slate-200">
                        <th className="p-4 text-sm font-semibold text-slate-600">Customer</th>
                        <th className="p-4 text-sm font-semibold text-slate-600">Email</th>
                        <th className="p-4 text-sm font-semibold text-slate-600">Phone</th>
                        <th className="p-4 text-sm font-semibold text-slate-600">Orders</th>
                        <th className="p-4 text-sm font-semibold text-slate-600">Joined</th>
                    </tr></thead>
                    <tbody>
                        {customers.length === 0 ? <tr><td colSpan={5} className="p-12 text-center text-slate-500">No customers yet.</td></tr> : customers.map((customer) => (
                            <tr key={customer.id} className="border-b border-slate-100">
                                <td className="p-4 font-semibold text-slate-900">{customer.name}</td>
                                <td className="p-4 text-sm text-slate-600">{customer.email || 'Not provided'}</td>
                                <td className="p-4 text-sm text-slate-600">{customer.phone || 'Not provided'}</td>
                                <td className="p-4 font-semibold text-slate-700">{customer._count.orders}</td>
                                <td className="p-4 text-sm text-slate-500">{customer.createdAt.toLocaleDateString('en-IN')}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
