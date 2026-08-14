const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const content = await prisma.content.findFirst({
    where: {
      titulo: {
        contains: 'POINT FIGHTING'
      }
    }
  });
  if (content) {
    console.log("===START===");
    console.log(content.cuerpo);
    console.log("===END===");
  } else {
    console.log("No encontrado");
  }
}
main().finally(() => prisma.$disconnect());
