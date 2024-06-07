const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

async function main() {
  // Seed User data
  const user1 = await prisma.user.create({
    data: {
      email: "user1@example.com",
      name: "User One",
      password: "password123",
    },
  });

  const user2 = await prisma.user.create({
    data: {
      email: "user2@example.com",
      name: "User Two",
      password: "password456",
    },
  });

  // Seed ProductCategory data
  const category1 = await prisma.productCategory.create({
    data: {
      name: "Category One",
    },
  });

  const category2 = await prisma.productCategory.create({
    data: {
      name: "Category Two",
    },
  });

  // Seed Product data
  const product1 = await prisma.product.create({
    data: {
      sku: "SKU123",
      name: "Product One",
      description: "Description of Product One",
      weight: 10,
      width: 5,
      length: 10,
      height: 3,
      image:
        "/file/1717777298287-clark-street-mercantile-P3pI6xzovu0-unsplash.jpg",
      price: 100,
      productCategoryId: category1.id,
    },
  });

  const product2 = await prisma.product.create({
    data: {
      sku: "SKU456",
      name: "Product Two",
      description: "Description of Product Two",
      weight: 15,
      width: 8,
      length: 12,
      height: 4,
      image:
        "/file/1717775940100-clark-street-mercantile-P3pI6xzovu0-unsplash.jpg",
      price: 150,
      productCategoryId: category2.id,
    },
  });

  console.log("Data seeded successfully!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
