const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Sembrando datos de inicio (Modo Producción Limpio)...');

  // 1. Limpiar base de datos
  await prisma.payment.deleteMany();
  await prisma.featuredStudent.deleteMany();
  await prisma.student.deleteMany();
  await prisma.club.deleteMany();
  await prisma.content.deleteMany();
  await prisma.moduleData.deleteMany();
  await prisma.adminUser.deleteMany();

  // 2. Crear usuario administrador
  const adminUser = process.env.ADMIN_USER || 'admin_local';
  const adminPass = process.env.ADMIN_PASSWORD || 'password_local';
  
  if (process.env.NODE_ENV === 'production' && (!process.env.ADMIN_USER || !process.env.ADMIN_PASSWORD)) {
    console.error('⚠️ ALERTA: Usando credenciales por defecto en PRODUCCIÓN. ¡Por favor define ADMIN_USER y ADMIN_PASSWORD en Vercel!');
  }

  const passwordHash = await bcrypt.hash(adminPass, 10);
  await prisma.adminUser.create({
    data: {
      usuario: adminUser,
      passwordHash,
      rol: 'ADMIN',
    },
  });
  console.log(`✅ Usuario Administrador creado: ${adminUser} / [OCULTO]`);

  // 3. Crear Clubes / Sedes por defecto
  const club1 = await prisma.club.create({
    data: {
      nombre: "Najera's Team Central",
      descripcion: 'Sede principal especializada en Taekwondo olímpico, Kickboxing y combate formativo.',
    },
  });

  const club2 = await prisma.club.create({
    data: {
      nombre: 'Strikers Kickboxing Club',
      descripcion: 'Especializados en K1, Full Contact y preparación física de combate.',
    },
  });

  const club3 = await prisma.club.create({
    data: {
      nombre: 'Dragones Amarillos',
      descripcion: 'Enfoque en desarrollo infantil, disciplina y valores para jóvenes.',
    },
  });
  console.log('✅ Clubes por defecto creados.');

  // 4. Módulos Varios
  const modulos = [
    { modulo: 'CLUBES', titulo: 'Red de Clubes Oficiales', descripcion: 'Do-Jangs afiliados con certificación nacional.', icono: 'Shield' },
    { modulo: 'GRADOS', titulo: 'Sistema de Grados KUP y DAN', descripcion: 'Evaluaciones y exámenes periódicos de cinturón.', icono: 'Award' },
    { modulo: 'HISTORIAL', titulo: 'Registro Histórico de Combates', descripcion: 'Base de datos con combates y rankings del circuito.', icono: 'History' },
    { modulo: 'LLAVES', titulo: 'Generador de Brackets', descripcion: 'Llaves de eliminación directa para torneos.', icono: 'GitMerge' },
    { modulo: 'CARNETS', titulo: 'Carnets Digitales', descripcion: 'Credencial digital con QR oficial de la academia.', icono: 'CreditCard' },
    { modulo: 'DIPLOMAS', titulo: 'Certificados y Diplomas', descripcion: 'Generación de diplomas homologados con código de verificación.', icono: 'FileCheck' },
  ];

  for (const m of modulos) {
    await prisma.moduleData.create({ data: m });
  }
  console.log('✅ Módulos de configuración creados.');

  console.log('✅ Base de datos sembrada con éxito.');
}

main()
  .catch((e) => {
    console.error('❌ Error sembrando datos:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
