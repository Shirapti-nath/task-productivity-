import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import pg from "pg";

const { Client } = pg;

const client = new Client({
  connectionString: process.env.DATABASE_URL,
});

const adapter = new PrismaPg(client);
const prisma = new PrismaClient({ adapter });

async function main() {
  await prisma.task.createMany({
    data: [
      {
        title: "Learn NestJS",
        description: "Build backend API",
      },
      {
        title: "Learn Prisma",
        description: "Create migrations",
      },
      {
        title: "Build Frontend",
        description: "Create Next.js UI",
      },
    ],
  });

  console.log("Seed data inserted successfully");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });