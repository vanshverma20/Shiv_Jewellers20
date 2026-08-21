import Link from 'next/link';
import { ShoppingBag, Search, Menu, QrCode } from 'lucide-react';
import prisma from '@/lib/db';

export const dynamic = 'force-dynamic';

export default async function HomePage() {
  const featuredProducts = await prisma.product.findMany({
    where: { isFeatured: true, status: 'ACTIVE' },
    include: { pricing: true, images: true, category: true },
    take: 4
  });

  const categories = await prisma.category.findMany({ take: 6 });

  return (
    <div className="min-h-screen bg-white font-sans text-slate-900 flex flex-col">
      {/* Navbar Placeholder */}
      <header className="border-b border-slate-200 sticky top-0 bg-white/95 backdrop-blur z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Menu className="md:hidden" />
            <Link href="/" className="text-xl font-serif tracking-widest uppercase font-bold text-slate-900">
              JWL<span className="text-amber-600">.</span>
            </Link>
          </div>
          
          <nav className="hidden md:flex gap-8 text-sm font-medium tracking-wide">
            <Link href="/shop" className="text-slate-600 hover:text-amber-600 transition">READY TO WEAR</Link>
            <Link href="/shop/bridal" className="text-slate-600 hover:text-amber-600 transition">BRIDAL</Link>
            <Link href="/shop/gifts" className="text-slate-600 hover:text-amber-600 transition">GIFTS</Link>
          </nav>

          <div className="flex items-center gap-5">
            <Link href="/scanner" className="text-slate-600 hover:text-emerald-600 transition p-2 bg-slate-100 rounded-full group flex items-center gap-2 shadow-sm border border-slate-200" title="Scan QR Code">
              <QrCode size={16} className="text-slate-700 group-hover:text-emerald-700 group-hover:scale-110 transition-transform" />
              <span className="hidden sm:inline text-xs font-semibold uppercase tracking-wider pr-1">Verify</span>
            </Link>
            <Search size={20} className="text-slate-600 hover:text-amber-600 cursor-pointer transition" />
            <ShoppingBag size={20} className="text-slate-600 hover:text-amber-600 cursor-pointer transition" />
          </div>
        </div>
      </header>
      
      {/* Hero */}
      <section className="relative h-[75vh] bg-slate-900 flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1599643478514-4a110185966d?auto=format&fit=crop&q=80')] bg-cover bg-center opacity-40 mix-blend-overlay"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/20 to-transparent flex items-center justify-center">
          <div className="text-center px-4 max-w-4xl mt-12">
            <h2 className="text-amber-500 font-semibold tracking-[0.25em] mb-4 text-xs md:text-sm uppercase">Heritage Collection</h2>
            <h1 className="text-5xl md:text-7xl font-serif text-white mb-6 leading-tight drop-shadow-lg">Elegance in Every Detail</h1>
            <p className="text-slate-300 md:text-lg mb-8 max-w-2xl mx-auto font-light leading-relaxed drop-shadow">Discover our handcrafted masterpieces. Each piece uses ethically sourced materials and tells its own unique story through our verified QR technology.</p>
            <Link href="/shop" className="inline-block bg-white text-slate-900 font-medium px-8 py-3.5 tracking-widest text-sm hover:bg-amber-500 hover:text-white transition-all duration-300 shadow-xl border border-transparent hover:border-amber-400">
              EXPLORE COLLECTION
            </Link>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="flex flex-col items-center mb-12">
          <h2 className="text-3xl font-serif text-slate-900 mb-3">Shop by Category</h2>
          <div className="w-16 h-[2px] bg-amber-500"></div>
        </div>
        
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-8">
           {categories.length > 0 ? (
             categories.map(c => (
               <Link key={c.id} href={`/shop/${c.slug}`} className="group cursor-pointer">
                 <div className="aspect-[4/5] bg-slate-100 mb-4 overflow-hidden relative rounded-sm shadow-sm border border-slate-200">
                   {/* Placeholders since we haven't loaded images */}
                   <div className="w-full h-full bg-slate-200 group-hover:scale-105 transition-transform duration-700 ease-out flex items-center justify-center text-slate-400 bg-[url('https://images.unsplash.com/photo-1611591437281-460bfbe1220a?auto=format&fit=crop&q=80&w=600')] bg-cover bg-center">
                     <div className="absolute inset-0 bg-slate-900/10 group-hover:bg-transparent transition-colors"></div>
                   </div>
                 </div>
                 <h3 className="text-center font-medium tracking-widest group-hover:text-amber-600 transition-colors uppercase text-sm text-slate-800">{c.name}</h3>
               </Link>
             ))
           ) : (
             <div className="col-span-full text-center text-slate-500 py-16 border-2 border-dashed border-slate-200 rounded-lg bg-slate-50">
               Categories will appear here once added by Admin.
             </div>
           )}
        </div>
      </section>

      <footer className="mt-auto bg-slate-900 text-slate-300 py-16 px-4 sm:px-6 lg:px-8 border-t border-slate-800">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12">
          <div className="md:col-span-2 lg:col-span-1">
            <Link href="/" className="text-2xl font-serif tracking-widest uppercase font-bold text-white mb-4 block">
              JWL<span className="text-amber-500">.</span>
            </Link>
            <p className="text-sm text-slate-400 max-w-xs leading-loose">
              Exquisite fine jewelry crafted for the modern connoisseur. Featuring traceable QR authentications for every masterpiece.
            </p>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-6 uppercase text-xs tracking-[0.2em]">Shop</h4>
            <ul className="space-y-4 text-sm font-light">
              <li><Link href="/shop" className="hover:text-amber-500 transition">All Products</Link></li>
              <li><Link href="/shop/collections" className="hover:text-amber-500 transition">Collections</Link></li>
            </ul>
          </div>
          <div>
             <h4 className="text-white font-semibold mb-6 uppercase text-xs tracking-[0.2em]">Customer Care</h4>
            <ul className="space-y-4 text-sm font-light">
              <li><Link href="/contact" className="hover:text-amber-500 transition">Contact Us</Link></li>
              <li><Link href="/scanner" className="text-emerald-400 hover:text-emerald-300 transition flex items-center gap-2 font-medium">Verify Product <QrCode size={16}/></Link></li>
            </ul>
          </div>
        </div>
        <div className="max-w-7xl mx-auto mt-16 pt-8 border-t border-slate-800 text-sm text-slate-500 flex flex-col md:flex-row justify-between items-center font-light">
          <p>&copy; {new Date().getFullYear()} JWL Commerce. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
