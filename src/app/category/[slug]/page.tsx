import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Gem, ArrowLeft } from 'lucide-react';
import prisma from '@/lib/db';

export const dynamic = 'force-dynamic';

export default async function CategoryPage({ params }: { params: { slug: string } }) {
  const category = await prisma.category.findUnique({
    where: { slug: params.slug },
  });

  if (!category) {
    return notFound();
  }

  const products = await prisma.product.findMany({
    where: {
      status: 'ACTIVE',
      categoryId: category.id,
    },
    include: { images: true, category: true, details: true, pricing: true },
    orderBy: { createdAt: 'desc' }
  });

  return (
    <div className="min-h-screen bg-stone-50 font-sans text-slate-900 pb-20">
      <header className="border-b border-stone-200 bg-white/95 backdrop-blur z-50 shadow-sm sticky top-0">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center gap-4">
          <Link href="/" className="p-2 hover:bg-stone-100 rounded-full transition-colors">
            <ArrowLeft size={20} />
          </Link>
          <div>
            <h1 className="text-xl font-serif font-bold text-slate-900">{category.name}</h1>
            <p className="text-xs text-slate-500">{products.length} Products</p>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-10">
        {products.length === 0 ? (
          <div className="text-center py-20 border-2 border-dashed border-stone-300 rounded-lg bg-stone-100">
            <p className="text-slate-500">No products found in this category.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {products.map(p => (
              <Link key={p.id} href={`/scan/${p.publicId}`} className="group">
                <div className="aspect-[4/5] rounded-lg overflow-hidden bg-stone-100 border border-stone-200 shadow-sm relative">
                  {p.images && p.images.length > 0 ? (
                    <img src={p.images[0].url} alt={p.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-stone-400">
                      <Gem size={40} />
                    </div>
                  )}
                  <div className="absolute top-2 right-2 bg-white/90 backdrop-blur rounded-full px-2 py-1 text-xs font-bold text-amber-700 border border-amber-200 shadow">
                    {p.details?.metalType || 'Jewelry'}
                  </div>
                </div>
                <div className="mt-3 px-1">
                  <h3 className="font-semibold text-slate-800 text-sm group-hover:text-amber-700 transition-colors truncate">{p.name}</h3>
                  <p className="text-slate-400 text-xs mt-0.5">{p.category.name} · {p.details?.metalPurity}</p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
