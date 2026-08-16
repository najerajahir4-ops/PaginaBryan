const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const users = await prisma.adminUser.findMany();
  console.log("Admin users in DB:", users);
}
main().finally(() => prisma.$disconnect());
