import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("🔐 Resetting admin user...");

  const seedPassword = process.env.ADMIN_SEED_PASSWORD;
  if (!seedPassword) {
    console.error("❌ ADMIN_SEED_PASSWORD is not set. Add it to .env before running this script.");
    process.exit(1);
  }
  const password = await bcrypt.hash(seedPassword, 12);

  const admin = await prisma.user.upsert({
    where: { email: "admin@prompts.chat" },
    update: {
      password: password,
      role: "ADMIN",
    },
    create: {
      email: "admin@prompts.chat",
      username: "admin",
      name: "Admin User",
      password: password,
      role: "ADMIN",
      locale: "en",
    },
  });

  console.log("✅ Admin user reset successfully!");
  console.log("\n📋 Credentials:");
  console.log("   Email:    admin@prompts.chat");
  console.log("   Password: [set via ADMIN_SEED_PASSWORD env var]");
}

main()
  .catch((e) => {
    console.error("❌ Failed to reset admin:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
