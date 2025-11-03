import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // eslint-disable-next-line no-console
  console.log('🌱 Seeding database...');

  // Clear existing data
  await prisma.product.deleteMany();
  await prisma.category.deleteMany();

  // Create Categories
  const electronics = await prisma.category.create({
    data: {
      name: 'Electronics',
      slug: 'electronics',
      description: 'Electronic devices and gadgets',
      image: 'https://images.unsplash.com/photo-1498049794561-7780e7231661?w=400',
    },
  });

  const laptops = await prisma.category.create({
    data: {
      name: 'Laptops',
      slug: 'laptops',
      description: 'Portable computers for work and gaming',
      image: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=400',
      parentId: electronics.id,
    },
  });

  const smartphones = await prisma.category.create({
    data: {
      name: 'Smartphones',
      slug: 'smartphones',
      description: 'Mobile phones and accessories',
      image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400',
      parentId: electronics.id,
    },
  });

  const clothing = await prisma.category.create({
    data: {
      name: 'Clothing',
      slug: 'clothing',
      description: 'Fashion and apparel',
      image: 'https://images.unsplash.com/photo-1558769132-cb1aea3c9a4a?w=400',
    },
  });

  const mensClothing = await prisma.category.create({
    data: {
      name: "Men's Clothing",
      slug: 'mens-clothing',
      description: 'Clothing for men',
      image: 'https://images.unsplash.com/photo-1594938291221-94f18cbb5660?w=400',
      parentId: clothing.id,
    },
  });

  const womensClothing = await prisma.category.create({
    data: {
      name: "Women's Clothing",
      slug: 'womens-clothing',
      description: 'Clothing for women',
      image: 'https://images.unsplash.com/photo-1560243563-062bfc001d68?w=400',
      parentId: clothing.id,
    },
  });

  // Create Products
  const products = [
    // Laptops
    {
      name: 'MacBook Pro 16"',
      slug: 'macbook-pro-16',
      description:
        'Powerful laptop with M3 Pro chip, 16-inch Liquid Retina XDR display, and up to 22 hours of battery life.',
      price: 2499.0,
      comparePrice: 2799.0,
      sku: 'MBP-16-M3-001',
      stock: 15,
      images: [
        'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800',
        'https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?w=800',
      ],
      categoryId: laptops.id,
      isActive: true,
      isFeatured: true,
    },
    {
      name: 'Dell XPS 15',
      slug: 'dell-xps-15',
      description:
        'Premium Windows laptop with Intel i7 processor, 15.6-inch 4K display, and sleek design.',
      price: 1899.0,
      comparePrice: 2199.0,
      sku: 'DELL-XPS15-001',
      stock: 12,
      images: [
        'https://images.unsplash.com/photo-1593642632823-8f785ba67e45?w=800',
        'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=800',
      ],
      categoryId: laptops.id,
      isActive: true,
      isFeatured: false,
    },
    {
      name: 'Lenovo ThinkPad X1 Carbon',
      slug: 'lenovo-thinkpad-x1',
      description:
        'Business ultrabook with legendary ThinkPad keyboard, 14-inch display, and military-grade durability.',
      price: 1649.0,
      sku: 'LENOVO-X1C-001',
      stock: 8,
      images: ['https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=800'],
      categoryId: laptops.id,
      isActive: true,
      isFeatured: false,
    },

    // Smartphones
    {
      name: 'iPhone 15 Pro',
      slug: 'iphone-15-pro',
      description:
        'Latest iPhone with A17 Pro chip, titanium design, and advanced camera system with 5x telephoto.',
      price: 999.0,
      comparePrice: 1099.0,
      sku: 'IPHONE-15PRO-001',
      stock: 25,
      images: [
        'https://images.unsplash.com/photo-1592286927505-2fd0aecf1177?w=800',
        'https://images.unsplash.com/photo-1591337676887-a217a6970a8a?w=800',
      ],
      categoryId: smartphones.id,
      isActive: true,
      isFeatured: true,
    },
    {
      name: 'Samsung Galaxy S24 Ultra',
      slug: 'samsung-galaxy-s24-ultra',
      description:
        'Premium Android phone with S Pen, 200MP camera, and stunning 6.8-inch Dynamic AMOLED display.',
      price: 1199.0,
      sku: 'SAMSUNG-S24U-001',
      stock: 18,
      images: [
        'https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=800',
        'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=800',
      ],
      categoryId: smartphones.id,
      isActive: true,
      isFeatured: true,
    },
    {
      name: 'Google Pixel 8 Pro',
      slug: 'google-pixel-8-pro',
      description:
        'Google flagship with Tensor G3 chip, incredible AI-powered camera, and pure Android experience.',
      price: 899.0,
      comparePrice: 999.0,
      sku: 'PIXEL-8PRO-001',
      stock: 20,
      images: ['https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=800'],
      categoryId: smartphones.id,
      isActive: true,
      isFeatured: false,
    },

    // Men's Clothing
    {
      name: 'Classic Denim Jacket',
      slug: 'classic-denim-jacket',
      description: 'Timeless denim jacket with vintage wash, perfect for layering in any season.',
      price: 89.99,
      comparePrice: 119.99,
      sku: 'DENIM-JKT-M-001',
      stock: 30,
      images: [
        'https://images.unsplash.com/photo-1495105787522-5334e3ffa0ef?w=800',
        'https://images.unsplash.com/photo-1544441893-675973e31985?w=800',
      ],
      categoryId: mensClothing.id,
      isActive: true,
      isFeatured: false,
    },
    {
      name: 'Premium Cotton T-Shirt',
      slug: 'premium-cotton-tshirt',
      description: 'Soft, breathable cotton t-shirt with modern fit. Available in multiple colors.',
      price: 29.99,
      sku: 'TSHIRT-M-001',
      stock: 100,
      images: ['https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=800'],
      categoryId: mensClothing.id,
      isActive: true,
      isFeatured: false,
    },

    // Women's Clothing
    {
      name: 'Floral Summer Dress',
      slug: 'floral-summer-dress',
      description:
        'Light and breezy summer dress with beautiful floral print, perfect for warm days.',
      price: 79.99,
      comparePrice: 99.99,
      sku: 'DRESS-W-001',
      stock: 40,
      images: [
        'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=800',
        'https://images.unsplash.com/photo-1540221652346-e5dd6b50f3e7?w=800',
      ],
      categoryId: womensClothing.id,
      isActive: true,
      isFeatured: true,
    },
    {
      name: 'Elegant Blazer',
      slug: 'elegant-blazer',
      description: 'Professional blazer with tailored fit, ideal for work or formal occasions.',
      price: 149.99,
      sku: 'BLAZER-W-001',
      stock: 22,
      images: ['https://images.unsplash.com/photo-1594938384824-58a7065f5f4f?w=800'],
      categoryId: womensClothing.id,
      isActive: true,
      isFeatured: false,
    },
  ];

  for (const product of products) {
    await prisma.product.create({ data: product });
  }

  // eslint-disable-next-line no-console
  console.log('✅ Seeding completed!');
  // eslint-disable-next-line no-console
  console.log(`   - ${await prisma.category.count()} categories created`);
  // eslint-disable-next-line no-console
  console.log(`   - ${await prisma.product.count()} products created`);
}

main()
  .catch((e) => {
    // eslint-disable-next-line no-console
    console.error('❌ Seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
