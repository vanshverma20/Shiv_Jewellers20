"use client";
import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Save, Loader2, QrCode, ImagePlus, X } from 'lucide-react';

const productSchema = z.object({
  name: z.string().min(2, 'Name is required'),
  sku: z.string().min(2, 'SKU is required'),
  categoryId: z.string().min(1, 'Category is required'),
  description: z.string().optional(),
  videoUrl: z.string().url('Enter a valid video URL').optional().or(z.literal('')),
  status: z.enum(['DRAFT', 'ACTIVE', 'ARCHIVED']).default('ACTIVE'),
  itemType: z.string().min(1, 'Item type is required'),
  metalType: z.string().min(1, 'Metal type is required'),
  metalPurity: z.string().min(1, 'Purity is required'),
  grossWeight: z.coerce.number().min(0).default(0),
  netWeight: z.coerce.number().min(0).default(0),
  stoneWeight: z.coerce.number().min(0).optional(),
  stoneType: z.string().optional(),
  stoneCount: z.coerce.number().int().min(0).default(0),
  color: z.string().optional(),
  size: z.string().optional(),
  hallmarkInfo: z.string().optional(),
  huid: z.string().optional(),
  basePrice: z.coerce.number().min(0).default(0),
  makingCharge: z.coerce.number().min(0).default(0),
  stoneCharge: z.coerce.number().min(0).default(0),
  discount: z.coerce.number().min(0).default(0),
  gstPercentage: z.coerce.number().min(0).max(100).default(3),
  stockQuantity: z.coerce.number().min(0).default(0),
  warehouseLoc: z.string().optional(),
});

export function ProductForm({ categories }: { categories: any[] }) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successData, setSuccessData] = useState<any>(null);
  const [submitError, setSubmitError] = useState('');
  const [images, setImages] = useState<{ file: File; preview: string }[]>([]);
  const fileRef = useRef<HTMLInputElement>(null);

  const { register, handleSubmit, formState } = useForm<any>({
    resolver: zodResolver(productSchema),
    defaultValues: { status: 'ACTIVE', stockQuantity: 0 }
  });
  const errors = formState.errors as any;

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const newImages = files.map(file => ({
      file,
      preview: URL.createObjectURL(file)
    }));
    setImages(prev => [...prev, ...newImages].slice(0, 6)); // max 6 images
  };

  const removeImage = (idx: number) => {
    setImages(prev => {
      URL.revokeObjectURL(prev[idx].preview);
      return prev.filter((_, i) => i !== idx);
    });
  };

  const onSubmit = async (data: any) => {
    setIsSubmitting(true);
    setSubmitError('');
    try {
      // Convert images to base64
      const imageBase64s = await Promise.all(
        images.map(img => new Promise<string>((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = () => resolve(reader.result as string);
          reader.onerror = reject;
          reader.readAsDataURL(img.file);
        }))
      );

      const res = await fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...data, images: imageBase64s })
      });
      const result = await res.json();
      if (!res.ok) throw new Error(result.error || 'Failed to create product');
      setSuccessData(result);
      setTimeout(() => window.scrollTo({ top: 0, behavior: 'smooth' }), 100);
    } catch (err: any) {
      setSubmitError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (successData) {
    return (
      <div className="bg-white p-8 rounded-xl border border-green-200 shadow-sm text-center">
        <div className="mx-auto w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-4">
          <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h2 className="text-2xl font-bold text-slate-900 mb-2">Product Successfully Created!</h2>
        <p className="text-slate-500 mb-6 font-mono">{successData.publicId}</p>

        <div className="flex flex-col md:flex-row items-center justify-center gap-8 mb-8 bg-slate-50 p-6 rounded-lg max-w-2xl mx-auto">
          <div className="flex flex-col items-center">
            <h3 className="text-sm font-semibold text-slate-600 uppercase tracking-wider mb-4 flex items-center gap-2">
              <QrCode size={16} /> QR Code Label
            </h3>
            <img src={successData.qrCode.qrData} alt="Product QR Code" className="w-40 h-40 bg-white p-2 rounded shadow-sm border border-slate-200" />
            <a href={successData.qrCode.qrData} download={`QR-${successData.publicId}.png`}
              className="mt-4 text-amber-600 hover:text-amber-700 font-medium text-sm transition-colors cursor-pointer">
              Download QR
            </a>
          </div>

          {successData.qrCode.barcodeData && (
            <div className="hidden md:block w-px h-32 bg-slate-200"></div>
          )}

          {successData.qrCode.barcodeData && (
            <div className="flex flex-col items-center">
              <h3 className="text-sm font-semibold text-slate-600 uppercase tracking-wider mb-4 flex items-center gap-2">
                <QrCode size={16} /> Barcode (Code128)
              </h3>
              <img src={successData.qrCode.barcodeData} alt="Product Barcode" className="w-48 h-20 bg-white p-2 border border-slate-200 rounded object-contain" />
              <a href={successData.qrCode.barcodeData} download={`BARCODE-${successData.publicId}.png`}
                className="mt-4 text-amber-600 hover:text-amber-700 font-medium text-sm transition-colors cursor-pointer">
                Download Barcode
              </a>
            </div>
          )}
        </div>

        <div className="flex gap-4 justify-center">
          <button onClick={() => router.push('/admin/products')} className="px-6 py-2 border border-slate-300 rounded-md text-slate-700 font-medium hover:bg-slate-50">
            Back to Products
          </button>
          <button onClick={() => { setSuccessData(null); router.refresh(); }} className="px-6 py-2 bg-slate-900 text-white rounded-md font-medium hover:bg-slate-800">
            Add Another Product
          </button>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
      {submitError && (
        <div className="p-4 bg-red-50 border border-red-200 text-red-600 rounded-md font-medium">
          {submitError}
        </div>
      )}

      {/* Basic Info */}
      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
        <h3 className="text-lg font-bold text-slate-900 border-b border-slate-100 pb-3 mb-5">Basic Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Product Name</label>
            <input type="text" {...register('name')} className="w-full rounded-md border border-slate-300 p-2.5 focus:border-amber-500 focus:outline-none" />
            {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">SKU</label>
            <input type="text" {...register('sku')} className="w-full rounded-md border border-slate-300 p-2.5 focus:border-amber-500 focus:outline-none" />
            {errors.sku && <p className="text-red-500 text-xs mt-1">{errors.sku.message}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Category</label>
            <select {...register('categoryId')} className="w-full rounded-md border border-slate-300 p-2.5 focus:border-amber-500 focus:outline-none">
              <option value="">Select Category...</option>
              {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
            {errors.categoryId && <p className="text-red-500 text-xs mt-1">{errors.categoryId.message}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Status</label>
            <select {...register('status')} className="w-full rounded-md border border-slate-300 p-2.5 focus:border-amber-500 focus:outline-none">
              <option value="ACTIVE">Active</option>
              <option value="DRAFT">Draft</option>
              <option value="ARCHIVED">Archived</option>
            </select>
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-slate-700 mb-1">Description</label>
            <textarea {...register('description')} rows={3} className="w-full rounded-md border border-slate-300 p-2.5 focus:border-amber-500 focus:outline-none"></textarea>
          </div>
        </div>
      </div>

      {/* Jewelry Details */}
      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
        <h3 className="text-lg font-bold text-slate-900 border-b border-slate-100 pb-3 mb-5">Jewelry Details</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Item Type</label>
            <input type="text" {...register('itemType')} placeholder="e.g. Ring, Bracelet" className="w-full rounded-md border border-slate-300 p-2.5 focus:border-amber-500 focus:outline-none" />
            {errors.itemType && <p className="text-red-500 text-xs mt-1">{errors.itemType.message}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Metal Type</label>
            <select {...register('metalType')} className="w-full rounded-md border border-slate-300 p-2.5 focus:border-amber-500 focus:outline-none">
              <option value="">Select...</option>
              <option value="Gold">Gold</option>
              <option value="Silver">Silver</option>
              <option value="Platinum">Platinum</option>
              <option value="Rose Gold">Rose Gold</option>
            </select>
            {errors.metalType && <p className="text-red-500 text-xs mt-1">{errors.metalType.message}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Purity</label>
            <input type="text" {...register('metalPurity')} placeholder="e.g. 22K, 925" className="w-full rounded-md border border-slate-300 p-2.5 focus:border-amber-500 focus:outline-none" />
            {errors.metalPurity && <p className="text-red-500 text-xs mt-1">{errors.metalPurity.message}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Stone Type (Optional)</label>
            <input type="text" {...register('stoneType')} placeholder="e.g. Diamond, Ruby" className="w-full rounded-md border border-slate-300 p-2.5 focus:border-amber-500 focus:outline-none" />
          </div>
          <div><label className="block text-sm font-medium text-slate-700 mb-1">Gross Weight (g)</label><input type="number" step="0.01" {...register('grossWeight')} className="w-full rounded-md border border-slate-300 p-2.5" /></div>
          <div><label className="block text-sm font-medium text-slate-700 mb-1">Net Weight (g)</label><input type="number" step="0.01" {...register('netWeight')} className="w-full rounded-md border border-slate-300 p-2.5" /></div>
          <div><label className="block text-sm font-medium text-slate-700 mb-1">Stone Weight (g)</label><input type="number" step="0.01" {...register('stoneWeight')} className="w-full rounded-md border border-slate-300 p-2.5" /></div>
          <div><label className="block text-sm font-medium text-slate-700 mb-1">Stone Count</label><input type="number" {...register('stoneCount')} className="w-full rounded-md border border-slate-300 p-2.5" /></div>
          <div><label className="block text-sm font-medium text-slate-700 mb-1">Colour</label><input type="text" {...register('color')} placeholder="e.g. Yellow Gold" className="w-full rounded-md border border-slate-300 p-2.5" /></div>
          <div><label className="block text-sm font-medium text-slate-700 mb-1">Size</label><input type="text" {...register('size')} placeholder="e.g. 18, Adjustable" className="w-full rounded-md border border-slate-300 p-2.5" /></div>
          <div><label className="block text-sm font-medium text-slate-700 mb-1">HUID</label><input type="text" {...register('huid')} className="w-full rounded-md border border-slate-300 p-2.5" /></div>
          <div className="md:col-span-2"><label className="block text-sm font-medium text-slate-700 mb-1">Certification / Hallmark</label><input type="text" {...register('hallmarkInfo')} placeholder="e.g. BIS Hallmarked" className="w-full rounded-md border border-slate-300 p-2.5" /></div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Stock Quantity</label>
            <input type="number" {...register('stockQuantity')} className="w-full rounded-md border border-slate-300 p-2.5 focus:border-amber-500 focus:outline-none" />
          </div>
        </div>
      </div>

      {/* Pricing */}
      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
        <h3 className="text-lg font-bold text-slate-900 border-b border-slate-100 pb-3 mb-5">Pricing & Inventory</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            ['basePrice', 'Product Price'], ['makingCharge', 'Making Charges'], ['stoneCharge', 'Stone Charges'], ['discount', 'Discount'], ['gstPercentage', 'GST %'], ['stockQuantity', 'Stock Quantity']
          ].map(([field, label]) => <div key={field}><label className="block text-sm font-medium text-slate-700 mb-1">{label}</label><input type="number" step="0.01" {...register(field)} className="w-full rounded-md border border-slate-300 p-2.5" /></div>)}
          <div><label className="block text-sm font-medium text-slate-700 mb-1">Location</label><input type="text" {...register('warehouseLoc')} placeholder="e.g. Showroom A" className="w-full rounded-md border border-slate-300 p-2.5" /></div>
        </div>
      </div>

      {/* Image Upload */}
      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
        <h3 className="text-lg font-bold text-slate-900 border-b border-slate-100 pb-3 mb-5">Product Photos</h3>
        <div
          className="border-2 border-dashed border-slate-300 rounded-xl p-8 text-center cursor-pointer hover:border-amber-400 hover:bg-amber-50/30 transition-colors"
          onClick={() => fileRef.current?.click()}
        >
          <ImagePlus className="mx-auto text-slate-400 mb-3" size={32} />
          <p className="text-slate-600 font-medium">Click to upload photos</p>
          <p className="text-slate-400 text-sm mt-1">PNG, JPG, WEBP up to 10MB · Max 6 photos</p>
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            multiple
            className="hidden"
            onChange={handleImageChange}
          />
        </div>

        {images.length > 0 && (
          <div className="mt-5 grid grid-cols-3 sm:grid-cols-6 gap-3">
            {images.map((img, idx) => (
              <div key={idx} className="relative group aspect-square rounded-lg overflow-hidden border border-slate-200 shadow-sm">
                <img src={img.preview} alt="" className="w-full h-full object-cover" />
                <button
                  type="button"
                  onClick={() => removeImage(idx)}
                  className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-opacity shadow"
                >
                  <X size={12} />
                </button>
                {idx === 0 && (
                  <span className="absolute bottom-1 left-1 bg-amber-500 text-white text-xs px-1.5 py-0.5 rounded">Main</span>
                )}
              </div>
            ))}
          </div>
        )}
        <div className="mt-5"><label className="block text-sm font-medium text-slate-700 mb-1">Product Video URL (Optional)</label><input type="url" {...register('videoUrl')} placeholder="https://..." className="w-full rounded-md border border-slate-300 p-2.5" /></div>
      </div>

      <div className="flex justify-end pt-6 border-t border-slate-200 pb-20">
        <button
          type="submit"
          disabled={isSubmitting}
          className="bg-amber-600 hover:bg-amber-700 text-white px-8 py-3 rounded-md font-medium text-lg flex items-center gap-2 transition-colors disabled:opacity-70 shadow-sm"
        >
          {isSubmitting ? <Loader2 className="animate-spin" size={20} /> : <Save size={20} />}
          Save & Generate QR
        </button>
      </div>
    </form>
  );
}
