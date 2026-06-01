import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const adminPassword = await bcrypt.hash("admin123", 12);
  const agentPassword = await bcrypt.hash("agent123", 12);

  await prisma.user.upsert({
    where: { email: "admin@doortrack.com" },
    update: {},
    create: {
      name: "System Admin",
      email: "admin@doortrack.com",
      password: adminPassword,
      role: "SUPER_ADMIN",
    },
  });

  await prisma.user.upsert({
    where: { email: "demo.agent@doortrack.com" },
    update: {},
    create: {
      name: "Demo Agent",
      email: "demo.agent@doortrack.com",
      phone: "+1 555 000 0000",
      password: agentPassword,
      role: "AGENT",
    },
  });

  console.log("Seed complete.");
  console.log("  Admin: admin@doortrack.com / admin123");
  console.log("  Agent: demo.agent@doortrack.com / agent123");
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
