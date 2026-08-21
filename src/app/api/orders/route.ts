import { NextResponse } from 'next/server';
import prisma from '@/lib/db';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function GET() {
  try {
    const orders = await prisma.order.findMany({
      include: {
        customer: true,
        items: true
      },
      orderBy: { createdAt: 'desc' }
    });
    return NextResponse.json(orders);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch orders' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || (session.user as any).role === 'STAFF') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const data = await req.json();
    
    // Create order and decrement inventory in a transaction
    const result = await prisma.$transaction(async (tx) => {
      // 1. Create order
      const order = await tx.order.create({
        data: {
          customerId: data.customerId,
          status: data.status,
          totalAmount: data.totalAmount,
          discountAmount: data.discountAmount,
          taxAmount: data.taxAmount,
          finalAmount: data.finalAmount,
          paymentMethod: data.paymentMethod,
          paymentStatus: data.paymentStatus,
          items: {
            create: data.items.map((item: any) => ({
              productId: item.productId,
              quantity: item.quantity,
              price: item.price
            }))
          }
        },
        include: { items: true }
      });

      // 2. Decrement inventory
      for (const item of data.items) {
        await tx.inventory.update({
          where: { productId: item.productId },
          data: {
            stockQuantity: { decrement: item.quantity },
            availableQuantity: { decrement: item.quantity },
            soldQuantity: { increment: item.quantity }
          }
        });
      }

      return order;
    });

    return NextResponse.json(result);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to create order' }, { status: 500 });
  }
}
