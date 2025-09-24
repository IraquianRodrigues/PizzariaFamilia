const { prisma } = require('../../src/lib/prisma');
const bcrypt = require('bcryptjs');

async function main() {
  const adminPhone = '+5584990000000';
  const existing = await prisma.user.findFirst({ where: { role: 'ADMIN' } });
  if (!existing) {
    const passwordHash = await bcrypt.hash('admin123', 10);
    await prisma.user.create({
      data: {
        name: 'Administrador',
        phone: adminPhone,
        password: passwordHash,
        role: 'ADMIN'
      }
    });
    console.log('Usuário admin criado: phone', adminPhone, 'senha: admin123');
  } else {
    console.log('Admin já existe, ignorando seed.');
  }
}

main().catch(e => {
  console.error(e);
  process.exit(1);
}).finally(async () => {
  await prisma.$disconnect();
});
