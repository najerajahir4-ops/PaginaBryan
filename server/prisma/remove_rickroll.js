const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log('Removing the Rick Astley videoUrl from Content records...');

  const result = await prisma.content.updateMany({
    where: {
      videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ'
    },
    data: {
      videoUrl: ''
    }
  });

  console.log(`Updated ${result.count} records to remove the video link.`);
}

main()
  .catch(e => {
    console.error('Error updating records:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
