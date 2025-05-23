const { PrismaClient } = require('../src/generated/prisma');
const { hashPassword } = require('../src/utils/auth');

const prisma = new PrismaClient();

async function main() {
  // Create admin user
  const adminPassword = await hashPassword('admin123');
  const admin = await prisma.user.upsert({
    where: { email: 'admin@example.com' },
    update: {},
    create: {
      email: 'admin@example.com',
      password: adminPassword,
      role: 'ADMIN',
    },
  });
  console.log('Created admin user:', admin);

  // Create regular user
  const userPassword = await hashPassword('user123');
  const user = await prisma.user.upsert({
    where: { email: 'user@example.com' },
    update: {},
    create: {
      email: 'user@example.com',
      password: userPassword,
      role: 'USER',
    },
  });
  console.log('Created regular user:', user);

  // Create sample employees if none exist
  const employeeCount = await prisma.employee.count();
  
  if (employeeCount === 0) {
    const employees = [
      {
        name: 'John Doe',
        age: 30,
        class: 'Math',
        subjects: 'Algebra, Calculus',
        attendance: 95.5,
      },
      {
        name: 'Jane Smith',
        age: 28,
        class: 'Science',
        subjects: 'Physics, Chemistry',
        attendance: 98.0,
      },
      {
        name: 'Bob Johnson',
        age: 35,
        class: 'History',
        subjects: 'World History, American History',
        attendance: 92.3,
      },
      {
        name: 'Sara Wilson',
        age: 27,
        class: 'English',
        subjects: 'Literature, Grammar',
        attendance: 97.8,
      },
      {
        name: 'Michael Brown',
        age: 32,
        class: 'Physical Education',
        subjects: 'Sports, Health',
        attendance: 90.0,
      },
      {
        name: 'Emma Davis',
        age: 31,
        class: 'Art',
        subjects: 'Painting, Sculpture',
        attendance: 93.5,
      },
      {
        name: 'Alex Rodriguez',
        age: 36,
        class: 'Music',
        subjects: 'Theory, Instruments',
        attendance: 91.2,
      },
      {
        name: 'Karen Miller',
        age: 29,
        class: 'Computer Science',
        subjects: 'Programming, Algorithms',
        attendance: 96.4,
      },
      {
        name: 'David Wilson',
        age: 33,
        class: 'Biology',
        subjects: 'Anatomy, Ecology',
        attendance: 94.1,
      },
      {
        name: 'Lisa Thompson',
        age: 34,
        class: 'Chemistry',
        subjects: 'Organic, Inorganic',
        attendance: 95.2,
      },
      {
        name: 'Kevin Harris',
        age: 31,
        class: 'Physics',
        subjects: 'Mechanics, Electricity',
        attendance: 92.7,
      },
      {
        name: 'Jennifer Lee',
        age: 30,
        class: 'Foreign Languages',
        subjects: 'Spanish, French',
        attendance: 98.3,
      },
      {
        name: 'Robert Taylor',
        age: 38,
        class: 'Geography',
        subjects: 'World Geography, Cartography',
        attendance: 91.9,
      },
      {
        name: 'Linda Martinez',
        age: 40,
        class: 'Psychology',
        subjects: 'Clinical, Educational',
        attendance: 94.8,
      },
      {
        name: 'Thomas Anderson',
        age: 35,
        class: 'Philosophy',
        subjects: 'Ethics, Logic',
        attendance: 93.0,
      },
    ];

    for (const employeeData of employees) {
      const employee = await prisma.employee.create({
        data: employeeData,
      });
      console.log('Created employee:', employee);
    }
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  }); 