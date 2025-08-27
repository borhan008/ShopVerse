import prisma from "@/lib/db";
import bcrypt from "bcrypt";

async function main() {
  console.log("Seeding start database...");
  await prisma.admin.deleteMany({});

  const password = await bcrypt.hash(
    "admin123",
    Number(process.env.SALT_ROUNDS) || 10
  );
  await prisma.admin.create({
    data: {
      name: "Admin",
      email: "admin@mail.com",
      password: password,
    },
  });

  await prisma.category.deleteMany({});
  await prisma.category.createMany({
    data: [
      { name: "Electronics", slug: "electronics" },
      { name: "Books", slug: "books" },
      { name: "Clothing", slug: "clothing" },
      { name: "Home & Kitchen", slug: "home-kitchen" },
    ],
  });
}

main()
  .then(async () => {
    console.log("Seeding completed successfully.");
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error("Error during seeding:", e);
    await prisma.$disconnect();
    process.exit(1);
  });
