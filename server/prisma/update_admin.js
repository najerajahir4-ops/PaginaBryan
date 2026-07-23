const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const prisma = new PrismaClient();

async function main() {
  console.log('🔄 Actualizando credenciales del Administrador...');
  const hash = await bcrypt.hash('1999', 10);
  
  // Buscar cualquier usuario admin existente
  const admin = await prisma.adminUser.findFirst();

  if (admin) {
    await prisma.adminUser.update({
      where: { id: admin.id },
      data: {
        usuario: 'arturo321',
        passwordHash: hash,
        rol: 'ADMIN'
      }
    });
    console.log('✅ Credenciales de Administrador actualizadas con éxito!');
  } else {
    await prisma.adminUser.create({
      data: {
        usuario: 'arturo321',
        passwordHash: hash,
        rol: 'ADMIN'
      }
    });
    console.log('✅ Administrador creado con éxito!');
  }
}

main()
  .catch(e => {
    console.error('❌ Error al actualizar admin:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
