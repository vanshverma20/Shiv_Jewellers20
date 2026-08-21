import { NextResponse } from 'next/server';
import prisma from '@/lib/db';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function GET() {
  try {
    const inventory = await prisma.inventory.findMany({
      include: {
        product: {
          select: { name: true, sku: true, publicId: true, images: true }
        }
      }
    });
    return NextResponse.json(inventory);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch inventory' }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || (session.user as any).role === 'STAFF') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { productId, adjustQuantity, warehouseLoc } = await req.json();
    
    const qty = parseInt(adjustQuantity);

    const updated = await prisma.inventory.update({
      where: { productId },
      data: {
        stockQuantity: { increment: qty },
        availableQuantity: { increment: qty },
        ...(warehouseLoc && { warehouseLoc })
      }
    });

    return NextResponse.json(updated);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update inventory' }, { status: 500 });
  }
}
