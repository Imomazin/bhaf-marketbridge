import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function resetPassword() {
  const adminEmail = 'fullstack@ambidexters.com';
  const newPassword = 'Test1234@@';
  const passwordHash = await bcrypt.hash(newPassword, 12);

  const admin = await prisma.user.update({
    where: { email: adminEmail },
    data: { passwordHash }
  });

  console.log(`Password reset for ${admin.email}`);
}

resetPassword()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
