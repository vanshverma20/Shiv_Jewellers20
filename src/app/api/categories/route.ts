import { NextResponse } from 'next/server';
import prisma from '@/lib/db';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function GET() {
  try {
    const categories = await prisma.category.findMany({
      orderBy: { name: 'asc' }
    });
    return NextResponse.json(categories);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch categories' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || (session.user as any).role === 'STAFF') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { name } = await req.json();
    if (!name) return NextResponse.json({ error: 'Name required' }, { status: 400 });

    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');

    const category = await prisma.category.create({
      data: { name, slug }
    });

    return NextResponse.json(category);
  } catch (error: any) {
    if (error.code === 'P2002') {
      return NextResponse.json({ error: 'Category slug already exists' }, { status: 400 });
    }
    return NextResponse.json({ error: 'Failed to create category' }, { status: 500 });
  }
}
