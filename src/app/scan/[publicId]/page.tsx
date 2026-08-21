import prisma from "@/lib/db";
import { notFound } from "next/navigation";
import { BadgeCheck, Phone, MapPin, Share2 } from "lucide-react";

export default async function ScanPage({ params }: { params: Promise<{ publicId: string }> }) {
  const { publicId } = await params;
  
  const product = await prisma.product.findUnique({
    where: { publicId },
    include: { details: true, pricing: true, images: true, category: true }
  });

  if (!product) {
    notFound();
  }

  // Find main image or use placeholder
  const mainImage = product.images.length > 0 ? (product.images.find(img => img.isMain)?.url || product.images[0].url) : 'https://images.unsplash.com/photo-1599643478514-4a110185966d?auto=format&fit=crop&q=80&w=1200';

  return (
    <div className="min-h-screen bg-slate-50 font-sans pb-20">
      {/* Verify Banner */}
      <div className="bg-emerald-600 text-white p-3 flex items-center justify-center gap-2 font-medium sticky top-0 z-10 shadow-sm text-sm">
        <BadgeCheck size={18} fill="currentColor" className="text-emerald-100" /> 
        Verified Original Product
      </div>

      <div className="max-w-md mx-auto bg-white min-h-screen shadow-sm md:max-w-2xl">
        <div className="aspect-square bg-slate-100 relative overflow-hidden">
          {/* Using img for simplicity without domain config */}
          <img src={mainImage} alt={product.name} className="w-full h-full object-cover" />
        </div>

        <div className="p-6">
          <div className="flex justify-between items-start mb-2">
            <div>
              <p className="text-sm font-semibold tracking-widest text-amber-600 uppercase mb-1">{product.category.name}</p>
              <h1 className="text-2xl font-bold tracking-tight text-slate-900">{product.name}</h1>
            </div>
            <button className="p-2 rounded-full bg-slate-100 text-slate-600 hover:bg-slate-200">
              <Share2 size={20} />
            </button>
          </div>
          
          <p className="text-xs text-slate-500 font-mono mb-6">ID: {product.publicId}</p>
          
          <div className="text-3xl font-light text-slate-900 mb-6">
            ₹{product.pricing?.finalSellingPrice?.toLocaleString() || "Price on Request"}
            <span className="text-sm text-slate-500 ml-2">incl. taxes</span>
          </div>

          <div className="space-y-6">
            <div>
              <h3 className="text-sm font-semibold text-slate-900 uppercase tracking-wide border-b border-slate-200 pb-2 mb-3">Product Specifications</h3>
              <dl className="grid grid-cols-2 gap-x-4 gap-y-3 text-sm">
                <div className="flex flex-col"><dt className="text-slate-500">Metal</dt><dd className="font-medium text-slate-900">{product.details?.metalPurity} {product.details?.metalType}</dd></div>
                <div className="flex flex-col"><dt className="text-slate-500">Gross Weight</dt><dd className="font-medium text-slate-900">{product.details?.grossWeight}g</dd></div>
                <div className="flex flex-col"><dt className="text-slate-500">Net Weight</dt><dd className="font-medium text-slate-900">{product.details?.netWeight}g</dd></div>
                {product.details?.stoneType && <div className="flex flex-col"><dt className="text-slate-500">Stone</dt><dd className="font-medium text-slate-900">{product.details?.stoneType} ({product.details?.stoneWeight}g)</dd></div>}
              </dl>
            </div>

            {product.details?.hallmarkInfo && (
              <div className="bg-amber-50 rounded-lg p-4 flex gap-3 text-sm border border-amber-100 pb-4">
                <BadgeCheck className="text-amber-600 flex-shrink-0" size={20} />
                <div>
                  <p className="font-semibold text-amber-900">Hallmark Certified</p>
                  <p className="text-amber-800 mt-1">{product.details.hallmarkInfo} • HUID: {product.details.huid}</p>
                </div>
              </div>
            )}

            <div>
               <h3 className="text-sm font-semibold text-slate-900 uppercase tracking-wide border-b border-slate-200 pb-2 mb-3">Description</h3>
               <p className="text-slate-600 text-sm leading-relaxed whitespace-pre-wrap">{product.description || product.shortDescription || "No description provided."}</p>
            </div>
            
            <div className="pt-6 border-t border-slate-200 flex flex-col gap-3">
              <button className="w-full bg-slate-900 text-white font-medium py-3 rounded-lg shadow flex items-center justify-center gap-2">
                <Phone size={18} /> Contact Store
              </button>
              <button className="w-full bg-white border border-slate-300 text-slate-700 font-medium py-3 rounded-lg flex items-center justify-center gap-2 hover:bg-slate-50">
                <MapPin size={18} /> Find in Store
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
