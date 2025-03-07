const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  // Clear existing data in correct order
  await prisma.checkIn.deleteMany({});
  await prisma.booking.deleteMany({});
  await prisma.hotel.deleteMany({});
  
  // Create hotels with valid image URLs
  await prisma.hotel.createMany({
    data: [
      {
        name: "Luxury Hotel & Spa",
        location: "Downtown City",
        price: 299,
        image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-4.0.3"
      },
      {
        name: "Business Plaza Hotel",
        location: "Financial District",
        price: 199,
        image: "https://images.unsplash.com/photo-1564501049412-61c2a3083791?ixlib=rb-4.0.3"
      },
      {
        name: "Seaside Resort",
        location: "Beach Front",
        price: 399,
        image: "https://images.unsplash.com/photo-1571896349842-33c89424de2d?ixlib=rb-4.0.3"
      }
    ]
  });

  console.log('Database seeded successfully');
}

main()
  .catch((e) => {
    console.error('Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });