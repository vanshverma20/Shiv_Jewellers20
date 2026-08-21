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
    
    // Generate Public ID
    let publicId = generatePublicId();
    let isUnique = false;
    while (!isUnique) {
      const existing = await prisma.product.findUnique({ where: { publicId } });
      if (!existing) isUnique = true;
      else publicId = generatePublicId();
    }

    // Generate QR & Barcode details
    const { url, qrDataUri } = await generateProductQRCode(publicId);
    const barcodeDataUri = await generateProductBarcode(publicId);

    // Create the product in a transaction to ensure all related data is inserted
    const product = await prisma.product.create({
      data: {
        publicId,
        sku: data.sku,
        name: data.name,
        slug: data.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '') + '-' + publicId.slice(-4).toLowerCase(),
        description: data.description,
        shortDescription: data.shortDescription,
        status: data.status || 'DRAFT',
        categoryId: data.categoryId,
        details: {
          create: {
            metalType: data.metalType,
            metalPurity: data.metalPurity,
            grossWeight: parseFloat(data.grossWeight),
            netWeight: parseFloat(data.netWeight),
            stoneWeight: data.stoneWeight ? parseFloat(data.stoneWeight) : null,
            stoneType: data.stoneType,
            stoneCount: data.stoneCount ? parseInt(data.stoneCount) : 0,
            stoneColor: data.stoneColor,
            huid: data.huid,
            hallmarkInfo: data.hallmarkInfo,
          }
        },
        pricing: {
          create: {
            basePrice: parseFloat(data.basePrice),
            makingCharge: data.makingCharge ? parseFloat(data.makingCharge) : 0,
            stoneCharge: data.stoneCharge ? parseFloat(data.stoneCharge) : 0,
            discount: data.discount ? parseFloat(data.discount) : 0,
            gstPercentage: data.gstPercentage ? parseFloat(data.gstPercentage) : 3,
            finalSellingPrice: parseFloat(data.finalSellingPrice),
          }
        },
        inventory: {
          create: {
            stockQuantity: data.stockQuantity ? parseInt(data.stockQuantity) : 0,
            availableQuantity: data.stockQuantity ? parseInt(data.stockQuantity) : 0,
            warehouseLoc: data.warehouseLoc,
          }
        },
        qrCode: {
          create: {
            url,
            qrData: qrDataUri,
            barcodeData: barcodeDataUri
          }
        }
      },
      include: {
        details: true,
        pricing: true,
        inventory: true,
        qrCode: true
      }
    });

    return NextResponse.json(product);
  } catch (error: any) {
    if (error.code === 'P2002') {
      return NextResponse.json({ error: 'SKU or Slug already exists' }, { status: 400 });
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

    let where: any = {};
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
