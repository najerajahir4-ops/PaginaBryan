const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Inicializando campos de orden en la base de datos...');

  // 1. Backfill para Content
  const contents = await prisma.content.findMany({
    orderBy: { fechaPublicacion: 'asc' }
  });
  console.log(`Encontrados ${contents.length} artículos de contenido.`);
  for (let i = 0; i < contents.length; i++) {
    await prisma.content.update({
      where: { id: contents[i].id },
      data: { orden: i + 1 }
    });
  }
  console.log('✅ Backfill de contenido completado!');

  // 2. Backfill para FeaturedStudent
  const featured = await prisma.featuredStudent.findMany({
    orderBy: { createdAt: 'asc' }
  });
  console.log(`Encontrados ${featured.length} alumnos destacados.`);
  for (let i = 0; i < featured.length; i++) {
    await prisma.featuredStudent.update({
      where: { id: featured[i].id },
      data: { orden: i + 1 }
    });
  }
  console.log('✅ Backfill de alumnos destacados completado!');
}

main()
  .catch(e => {
    console.error('❌ Error en backfill:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
