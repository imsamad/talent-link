import { PrismaClient } from "@prisma/client";
import { skills_seed } from "../seeder/skills";
const prisma = new PrismaClient();

async function main() {
  await prisma.skill.createMany({
    data: [...new Set(skills_seed)].map((name) => ({ name })),
  });
  console.log("Database seeded successfully!");
  process.exit(1);
}

main();
