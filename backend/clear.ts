import { prisma } from './src/data/prismaClient';

async function clear() {
  await prisma.inscripcion.deleteMany();
  console.log('Base de datos limpiada exitosamente.');
}

clear().finally(() => prisma.$disconnect());
