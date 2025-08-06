import { PrismaClient } from '@prisma/client';
import { faker } from '@faker-js/faker';

const prisma = new PrismaClient();

async function main() {
  // Create Users with Drivers
  for (let i = 0; i < 5; i++) {
    const user = await prisma.user.create({
      data: {
        fullName: faker.person.fullName(),
        email: faker.internet.email(),
        role: 'DRIVER',
      },
    });

    await prisma.driver.create({
      data: {
        userId: user.id,
        locationLat: faker.location.latitude(),
        locationLng: faker.location.longitude(),
        status: 'available',
        lastActive: new Date(),
      },
    });
  }

  // Create Users as Customers
  for (let i = 0; i < 3; i++) {
    await prisma.user.create({
      data: {
        fullName: faker.person.fullName(),
        email: faker.internet.email(),
        role: 'CUSTOMER',
      },
    });
  }

  console.log('🌱 Seeding complete!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => {
    prisma.$disconnect();
  });
