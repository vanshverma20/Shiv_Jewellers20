import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const categories = [
    { name: 'Rings', slug: 'rings' },
    { name: 'Necklaces', slug: 'necklaces' },
    { name: 'Earrings', slug: 'earrings' },
    { name: 'Bracelets', slug: 'bracelets' },
    { name: 'Bangles', slug: 'bangles' },
    { name: 'Pendants', slug: 'pendants' },
    { name: 'Bali', slug: 'bali' },
    { name: 'Tops', slug: 'tops' },
  ];

  for (const cat of categories) {
    await prisma.category.upsert({
      where: { slug: cat.slug },
      update: {},
      create: cat,
    });
  }

  console.log('✅ Seeded 8 jewelry categories');
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
