const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function cleanDatabase() {
  // Limpa todas as tabelas do banco de dados
  // A ordem é importante devido às foreign keys
  const tablenames = await prisma.$queryRaw`
    SELECT tablename FROM pg_tables 
    WHERE schemaname='public' AND tablename != '_prisma_migrations';
  `;

  for (const { tablename } of tablenames) {
    try {
      await prisma.$executeRawUnsafe(`TRUNCATE TABLE "${tablename}" CASCADE;`);
    } catch (error) {
      console.log({ error });
    }
  }
}

module.exports = {
  prisma,
  cleanDatabase,
};
