import { NextResponse } from 'next/server';
import prisma from '@/lib/db';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { generatePublicId, generateProductQRCode, generateProductBarcode } from '@/lib/qr';

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || (session.user as any).role === 'STAFF') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const data = await req.json();

    // Generate unique Public ID
    let publicId = generatePublicId();
    let isUnique = false;
    while (!isUnique) {
      const existing = await prisma.product.findUnique({ where: { publicId } });
      if (!existing) isUnique = true;
      else publicId = generatePublicId();
    }

    // Generate QR & Barcode
    const { url, qrDataUri } = await generateProductQRCode(publicId);
    const barcodeDataUri = await generateProductBarcode(publicId);

    // Build slug
    const slug = data.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '') + '-' + publicId.slice(-4).toLowerCase();

    // Create product with all related data
    const product = await prisma.product.create({
      data: {
        publicId,
        sku: data.sku,
        name: data.name,
        slug,
        description: data.description,
        itemType: data.itemType || null,
        videoUrl: data.videoUrl || null,
        status: data.status || 'ACTIVE',
        categoryId: data.categoryId,

        // Jewelry details (only required fields)
        details: {
          create: {
            metalType: data.metalType,
            metalPurity: data.metalPurity,
            itemType: data.itemType || null,
            grossWeight: data.grossWeight ? Number(data.grossWeight) : 0,
            netWeight: data.netWeight ? Number(data.netWeight) : 0,
            stoneType: data.stoneType || null,
            stoneWeight: data.stoneWeight ? Number(data.stoneWeight) : null,
            stoneCount: data.stoneCount ? parseInt(data.stoneCount) : 0,
            color: data.color || null,
            size: data.size || null,
            hallmarkInfo: data.hallmarkInfo || null,
            huid: data.huid || null,
          }
        },

        // Pricing defaults (no UI for it, zeroed out)
        pricing: {
          create: {
            basePrice: Number(data.basePrice || 0),
            makingCharge: Number(data.makingCharge || 0),
            stoneCharge: Number(data.stoneCharge || 0),
            discount: Number(data.discount || 0),
            gstPercentage: Number(data.gstPercentage ?? 3),
            finalSellingPrice: Math.max(0, (Number(data.basePrice || 0) + Number(data.makingCharge || 0) + Number(data.stoneCharge || 0)) * (1 + Number(data.gstPercentage ?? 3) / 100) - Number(data.discount || 0)),
          }
        },

        // Inventory
        inventory: {
          create: {
            stockQuantity: data.stockQuantity ? parseInt(data.stockQuantity) : 0,
            availableQuantity: data.stockQuantity ? parseInt(data.stockQuantity) : 0,
            warehouseLoc: data.warehouseLoc || null,
          }
        },

        // QR Code + Barcode
        qrCode: {
          create: {
            url,
            qrData: qrDataUri,
            barcodeData: barcodeDataUri
          }
        },

        // Images (base64 data URI stored directly)
        images: data.images && data.images.length > 0 ? {
          create: data.images.map((imgUrl: string, idx: number) => ({
            url: imgUrl,
            isMain: idx === 0,
            sortOrder: idx
          }))
        } : undefined,
      },
      include: {
        details: true,
        pricing: true,
        inventory: true,
        images: true,
        qrCode: true
      }
    });

    return NextResponse.json(product);
  } catch (error: any) {
    if (error.code === 'P2002') {
      return NextResponse.json({ error: 'SKU already exists. Please use a different SKU.' }, { status: 400 });
    }
    console.error(error);
    return NextResponse.json({ error: 'Failed to create product' }, { status: 500 });
  }
}

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const categoryId = searchParams.get('categoryId');
    const status = searchParams.get('status');

    const where: any = {};
    if (categoryId) where.categoryId = categoryId;
    if (status) where.status = status;

    const products = await prisma.product.findMany({
      where,
      include: {
        details: true,
        pricing: true,
        inventory: true,
        category: true,
        images: true,
        qrCode: true
      },
      orderBy: { createdAt: 'desc' }
    });

    return NextResponse.json(products);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch products' }, { status: 500 });
  }
}
