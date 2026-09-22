import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

async function main() {
  const users = await prisma.user.findMany({
    select: { email: true, role: true, name: true }
  })
  
  console.log("Users in Database:");
  users.forEach(u => console.log(`- Role: ${u.role}, Email: ${u.email}, Name: ${u.name}`));
}

main()
  .catch(e => console.error(e))
  .finally(async () => await prisma.$disconnect())
