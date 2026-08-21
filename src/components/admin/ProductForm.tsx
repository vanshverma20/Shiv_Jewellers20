"use client";
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Save, Loader2, QrCode } from 'lucide-react';

const productSchema = z.object({
  name: z.string().min(2, 'Name is required'),
  sku: z.string().min(2, 'SKU is required'),
  categoryId: z.string().min(1, 'Category is required'),
  description: z.string().optional(),
  shortDescription: z.string().optional(),
  status: z.enum(['DRAFT', 'ACTIVE', 'ARCHIVED']).default('ACTIVE'),
  metalType: z.string().min(1, 'Metal type is required'),
  metalPurity: z.string().min(1, 'Metal purity is required'),
  grossWeight: z.coerce.number().min(0.01),
  netWeight: z.coerce.number().min(0.01),
  stoneType: z.string().optional(),
  stoneWeight: z.coerce.number().optional().default(0),
  stoneCount: z.coerce.number().optional().default(0),
  basePrice: z.coerce.number().min(1),
  makingCharge: z.coerce.number().optional().default(0),
  stoneCharge: z.coerce.number().optional().default(0),
  gstPercentage: z.coerce.number().optional().default(3),
  // Auto-calculated fields could be derived, but we enforce strict validation here
  finalSellingPrice: z.coerce.number().min(1), 
  stockQuantity: z.coerce.number().min(0),
  warehouseLoc: z.string().optional(),
});

type ProductFormValues = z.infer<typeof productSchema>;

export function ProductForm({ categories }: { categories: any[] }) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successData, setSuccessData] = useState<any>(null);
  const [submitError, setSubmitError] = useState('');

  const { register, handleSubmit, formState, watch, setValue } = useForm<any>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      status: 'ACTIVE',
      gstPercentage: 3,
      makingCharge: 0,
      stoneCharge: 0,
    }
  });
  
  const errors = formState.errors as any;

  const onSubmit = async (data: any) => {
    setIsSubmitting(true);
    setSubmitError('');
    try {
      const res = await fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      const result = await res.json();
      
      if (!res.ok) throw new Error(result.error || 'Failed to create product');
      
      setSuccessData(result);
      // Wait briefly, then scroll to success state
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
            <input type="text" {...register('name')} className="w-full rounded-md border border-slate-300 p-2.5 focus:border-amber-500 focus:ring-amber-500" />
            {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">SKU</label>
            <input type="text" {...register('sku')} className="w-full rounded-md border border-slate-300 p-2.5 focus:border-amber-500 focus:ring-amber-500" />
            {errors.sku && <p className="text-red-500 text-xs mt-1">{errors.sku.message}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Category</label>
            <select {...register('categoryId')} className="w-full rounded-md border border-slate-300 p-2.5 focus:border-amber-500 focus:ring-amber-500">
              <option value="">Select Category...</option>
              {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
            {errors.categoryId && <p className="text-red-500 text-xs mt-1">{errors.categoryId.message}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Status</label>
            <select {...register('status')} className="w-full rounded-md border border-slate-300 p-2.5 focus:border-amber-500 focus:ring-amber-500">
              <option value="ACTIVE">Active</option>
              <option value="DRAFT">Draft</option>
              <option value="ARCHIVED">Archived</option>
            </select>
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-slate-700 mb-1">Description</label>
            <textarea {...register('description')} rows={4} className="w-full rounded-md border border-slate-300 p-2.5 focus:border-amber-500 focus:ring-amber-500"></textarea>
          </div>
        </div>
      </div>

      {/* Jewelry Details */}
      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
        <h3 className="text-lg font-bold text-slate-900 border-b border-slate-100 pb-3 mb-5">Jewelry Details</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Metal Type</label>
            <select {...register('metalType')} className="w-full rounded-md border border-slate-300 p-2.5 focus:border-amber-500 focus:ring-amber-500">
              <option value="">Select...</option>
              <option value="Gold">Gold</option>
              <option value="Silver">Silver</option>
              <option value="Platinum">Platinum</option>
            </select>
            {errors.metalType && <p className="text-red-500 text-xs mt-1">{errors.metalType.message}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Purity</label>
            <input type="text" {...register('metalPurity')} placeholder="e.g. 22K" className="w-full rounded-md border border-slate-300 p-2.5 focus:border-amber-500 focus:ring-amber-500" />
            {errors.metalPurity && <p className="text-red-500 text-xs mt-1">{errors.metalPurity.message}</p>}
          </div>
          <div className="hidden md:block"></div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Gross Weight (g)</label>
            <input type="number" step="0.01" {...register('grossWeight')} className="w-full rounded-md border border-slate-300 p-2.5 focus:border-amber-500 focus:ring-amber-500" />
            {errors.grossWeight && <p className="text-red-500 text-xs mt-1">{errors.grossWeight.message}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Net Weight (g)</label>
            <input type="number" step="0.01" {...register('netWeight')} className="w-full rounded-md border border-slate-300 p-2.5 focus:border-amber-500 focus:ring-amber-500" />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Stone Weight (cts/g)</label>
            <input type="number" step="0.01" {...register('stoneWeight')} className="w-full rounded-md border border-slate-300 p-2.5 focus:border-amber-500 focus:ring-amber-500" />
          </div>
        </div>
      </div>

      {/* Pricing & Inventory */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <h3 className="text-lg font-bold text-slate-900 border-b border-slate-100 pb-3 mb-5">Pricing</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Base Price</label>
              <input type="number" step="0.01" {...register('basePrice')} className="w-full rounded-md border border-slate-300 p-2.5 focus:border-amber-500 focus:ring-amber-500" />
            </div>
            <div className="flex gap-4">
              <div className="flex-1">
                <label className="block text-sm font-medium text-slate-700 mb-1">Making Charge</label>
                <input type="number" step="0.01" {...register('makingCharge')} className="w-full rounded-md border border-slate-300 p-2.5 focus:border-amber-500 focus:ring-amber-500" />
              </div>
              <div className="flex-1">
                <label className="block text-sm font-medium text-slate-700 mb-1">GST (%)</label>
                <input type="number" step="0.01" {...register('gstPercentage')} className="w-full rounded-md border border-slate-300 p-2.5 focus:border-amber-500 focus:ring-amber-500" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Final Selling Price (Required)</label>
              <input type="number" step="0.01" {...register('finalSellingPrice')} className="w-full rounded-md border border-amber-300 bg-amber-50 p-2.5 focus:border-amber-500 focus:ring-amber-500" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <h3 className="text-lg font-bold text-slate-900 border-b border-slate-100 pb-3 mb-5">Inventory</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Stock Quantity</label>
              <input type="number" {...register('stockQuantity')} className="w-full rounded-md border border-slate-300 p-2.5 focus:border-amber-500 focus:ring-amber-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Warehouse Location (Optional)</label>
              <input type="text" {...register('warehouseLoc')} className="w-full rounded-md border border-slate-300 p-2.5 focus:border-amber-500 focus:ring-amber-500" />
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-end pt-6 border-t border-slate-200 pb-20">
        <button 
          type="submit" 
          disabled={isSubmitting}
          className="bg-amber-600 hover:bg-amber-700 text-white px-8 py-3 rounded-md font-medium text-lg flex items-center gap-2 transition-colors disabled:opacity-70 shadow-sm"
        >
          {isSubmitting ? <Loader2 className="animate-spin" /> : <Save />}
          Save & Generate QR
        </button>
      </div>
    </form>
  );
}
