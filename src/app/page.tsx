import Link from 'next/link';
import { QrCode, Phone, MapPin, Clock, Shield, Gem, Star, ChevronRight } from 'lucide-react';
import prisma from '@/lib/db';

export const dynamic = 'force-dynamic';

export default async function HomePage() {
  const categories = await prisma.category.findMany({ take: 8 });
  const products = await prisma.product.findMany({
    where: { status: 'ACTIVE' },
    include: { images: true, category: true, details: true },
    take: 6,
    orderBy: { createdAt: 'desc' }
  });

  return (
    <div className="min-h-screen bg-stone-50 font-sans text-slate-900 flex flex-col">

      {/* Top Bar */}
      <div className="bg-slate-900 text-slate-300 text-xs py-2 px-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1"><Phone size={11} /> +91 98765 43210</span>
            <span className="hidden sm:flex items-center gap-1"><MapPin size={11} /> Main Market, Your City</span>
          </div>
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1"><Clock size={11} /> 10 AM – 9 PM</span>
            <Link href="/scanner" className="flex items-center gap-1 text-amber-400 hover:text-amber-300 font-medium transition">
              <QrCode size={11} /> Verify Product
            </Link>
          </div>
        </div>
      </div>

      {/* Navbar */}
      <header className="border-b border-stone-200 sticky top-0 bg-white/95 backdrop-blur z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <Link href="/" className="flex flex-col items-center">
            <span className="text-2xl md:text-3xl font-serif tracking-[0.15em] uppercase font-bold text-slate-900 leading-none">
              Shiv<span className="text-amber-600"> Jewellers</span>
            </span>
            <span className="text-[10px] tracking-[0.35em] uppercase text-slate-400 font-medium mt-0.5">Since 1995 · Trust & Tradition</span>
          </Link>

          <nav className="hidden md:flex gap-8 text-xs font-semibold tracking-[0.15em] uppercase text-slate-600">
            <Link href="/scanner" className="hover:text-amber-600 transition">Verify</Link>
            <Link href="/admin-login" className="hover:text-amber-600 transition">Admin</Link>
          </nav>

          <Link href="/scanner" className="md:hidden bg-amber-600 text-white px-3 py-2 rounded-lg text-xs font-semibold flex items-center gap-1.5">
            <QrCode size={14} /> Scan
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative h-[80vh] bg-slate-900 flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1515562141589-67f0d623a400?auto=format&fit=crop&q=80&w=2000')] bg-cover bg-center"></div>
        <div className="absolute inset-0 bg-gradient-to-b from-slate-900/70 via-slate-900/50 to-slate-900/90"></div>
        <div className="relative z-10 text-center px-4 max-w-4xl">
          <div className="inline-flex items-center gap-2 bg-amber-600/20 border border-amber-500/30 rounded-full px-5 py-1.5 mb-8">
            <Gem size={14} className="text-amber-400" />
            <span className="text-amber-300 text-xs font-semibold tracking-[0.2em] uppercase">Premium Jewelry Showroom</span>
          </div>
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-serif text-white mb-6 leading-[1.1] drop-shadow-2xl">
            Shiv<br/><span className="text-amber-400">Jewellers</span>
          </h1>
          <p className="text-stone-300 md:text-lg mb-10 max-w-2xl mx-auto font-light leading-relaxed">
            Crafting timeless elegance since 1995. Every piece in our showroom is hallmarked, 
            certified, and comes with a unique QR code for instant authenticity verification.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/scanner" className="inline-flex items-center justify-center gap-2 bg-amber-500 hover:bg-amber-400 text-slate-900 font-bold px-8 py-4 tracking-widest text-sm transition-all duration-300 shadow-xl shadow-amber-900/30 rounded-sm">
              <QrCode size={18} /> VERIFY YOUR JEWELRY
            </Link>
            <Link href="/admin-login" className="inline-flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 text-white font-semibold px-8 py-4 tracking-widest text-sm border border-white/20 transition-all duration-300 backdrop-blur rounded-sm">
              ADMIN PANEL <ChevronRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      {/* Trust Badges */}
      <section className="bg-white border-b border-stone-200">
        <div className="max-w-7xl mx-auto px-4 py-10 grid grid-cols-2 md:grid-cols-4 gap-6">
          {[
            { icon: Shield, title: 'BIS Hallmarked', desc: 'Every piece certified' },
            { icon: QrCode, title: 'QR Verified', desc: 'Scan to authenticate' },
            { icon: Gem, title: 'Pure Materials', desc: '22K Gold & 925 Silver' },
            { icon: Star, title: 'Since 1995', desc: '29+ years of trust' },
          ].map((item, i) => (
            <div key={i} className="flex items-start gap-3 p-3">
              <div className="w-10 h-10 rounded-full bg-amber-50 border border-amber-200 flex items-center justify-center shrink-0">
                <item.icon size={18} className="text-amber-600" />
              </div>
              <div>
                <p className="font-bold text-slate-900 text-sm">{item.title}</p>
                <p className="text-slate-500 text-xs mt-0.5">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Categories */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="flex flex-col items-center mb-14">
          <span className="text-amber-600 text-xs font-bold tracking-[0.3em] uppercase mb-3">Our Collections</span>
          <h2 className="text-3xl md:text-4xl font-serif text-slate-900 mb-3">Shop by Category</h2>
          <div className="w-20 h-[2px] bg-gradient-to-r from-transparent via-amber-500 to-transparent"></div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          {categories.length > 0 ? (
            categories.map((c, idx) => {
              const bgImages = [
                'https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&q=80&w=500',
                'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&q=80&w=500',
                'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&q=80&w=500',
                'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?auto=format&fit=crop&q=80&w=500',
                'https://images.unsplash.com/photo-1602751584552-8ba73aad10e1?auto=format&fit=crop&q=80&w=500',
                'https://images.unsplash.com/photo-1573408301185-9146fe634ad0?auto=format&fit=crop&q=80&w=500',
                'https://images.unsplash.com/photo-1515562141589-67f0d623a400?auto=format&fit=crop&q=80&w=500',
                'https://images.unsplash.com/photo-1596944924616-7b38e7cfac36?auto=format&fit=crop&q=80&w=500',
              ];
              return (
                <div key={c.id} className="group cursor-pointer">
                  <div className="aspect-[4/5] rounded-lg overflow-hidden relative shadow-md border border-stone-200">
                    <div
                      className="w-full h-full bg-cover bg-center group-hover:scale-110 transition-transform duration-700 ease-out"
                      style={{ backgroundImage: `url('${bgImages[idx % bgImages.length]}')` }}
                    ></div>
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-transparent to-transparent"></div>
                    <div className="absolute bottom-0 left-0 right-0 p-4">
                      <h3 className="text-white font-bold text-sm tracking-wider uppercase">{c.name}</h3>
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="col-span-full text-center text-slate-500 py-16 border-2 border-dashed border-stone-300 rounded-lg bg-stone-100">
              Categories will appear here once added by Admin.
            </div>
          )}
        </div>
      </section>

      {/* Latest Products */}
      {products.length > 0 && (
        <section className="py-16 bg-white border-t border-stone-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col items-center mb-14">
              <span className="text-amber-600 text-xs font-bold tracking-[0.3em] uppercase mb-3">Fresh Arrivals</span>
              <h2 className="text-3xl font-serif text-slate-900 mb-3">Latest Additions</h2>
              <div className="w-20 h-[2px] bg-gradient-to-r from-transparent via-amber-500 to-transparent"></div>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
              {products.map(p => (
                <Link key={p.id} href={`/scan/${p.publicId}`} className="group">
                  <div className="aspect-square rounded-lg overflow-hidden bg-stone-100 border border-stone-200 shadow-sm relative">
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
                    <p className="text-amber-600 text-[10px] font-mono mt-1">{p.publicId}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* QR Verification CTA */}
      <section className="py-20 bg-slate-900 text-white">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-amber-500/10 border border-amber-500/20 mb-6">
            <QrCode size={28} className="text-amber-400" />
          </div>
          <h2 className="text-3xl md:text-4xl font-serif mb-4">Verify Your Jewelry</h2>
          <p className="text-slate-400 max-w-xl mx-auto mb-8 font-light leading-relaxed">
            Every piece from Shiv Jewellers comes with a unique QR code tag. 
            Scan it anytime to instantly verify authenticity, purity, and origin.
          </p>
          <Link href="/scanner" className="inline-flex items-center gap-2 bg-amber-500 hover:bg-amber-400 text-slate-900 font-bold px-8 py-4 tracking-widest text-sm transition-all shadow-xl shadow-amber-900/30 rounded-sm">
            <QrCode size={18} /> OPEN SCANNER
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-950 text-slate-400 py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-12">
          <div>
            <h3 className="text-2xl font-serif tracking-[0.1em] uppercase font-bold text-white mb-2">
              Shiv<span className="text-amber-500"> Jewellers</span>
            </h3>
            <p className="text-sm max-w-xs leading-loose text-slate-500">
              Your trusted family jeweller since 1995. Every piece is hallmarked, certified, and backed by our QR verification technology.
            </p>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-4 uppercase text-xs tracking-[0.2em]">Quick Links</h4>
            <ul className="space-y-3 text-sm">
              <li><Link href="/scanner" className="hover:text-amber-400 transition flex items-center gap-2"><QrCode size={14} /> Verify Product</Link></li>
              <li><Link href="/admin-login" className="hover:text-amber-400 transition">Admin Login</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-4 uppercase text-xs tracking-[0.2em]">Visit Us</h4>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start gap-2"><MapPin size={14} className="shrink-0 mt-0.5" /> Main Market, Your City, India</li>
              <li className="flex items-center gap-2"><Phone size={14} /> +91 98765 43210</li>
              <li className="flex items-center gap-2"><Clock size={14} /> Mon–Sun, 10 AM – 9 PM</li>
            </ul>
          </div>
        </div>
        <div className="max-w-7xl mx-auto mt-12 pt-8 border-t border-slate-800 text-xs text-slate-600 text-center">
          <p>&copy; {new Date().getFullYear()} Shiv Jewellers. All rights reserved. Crafted with ❤️</p>
        </div>
      </footer>
    </div>
  );
}
