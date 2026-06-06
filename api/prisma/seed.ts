import { PrismaClient, Role } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('Clearing database...');
  await prisma.user.deleteMany();
  await prisma.position.deleteMany();
  await prisma.team.deleteMany();

  console.log('Seeding teams...');
  const teams = await Promise.all([
    prisma.team.create({ data: { name: 'Engineering' } }),
    prisma.team.create({ data: { name: 'Marketing' } }),
    prisma.team.create({ data: { name: 'Human Resources' } }),
  ]);

  console.log('Seeding positions...');
  const positions = await Promise.all([
    prisma.position.create({ data: { name: 'CEO' } }),
    prisma.position.create({ data: { name: 'CTO' } }),
    prisma.position.create({ data: { name: 'CMO' } }),
    prisma.position.create({ data: { name: 'HR Manager' } }),
    prisma.position.create({ data: { name: 'Senior Developer' } }),
    prisma.position.create({ data: { name: 'Junior Developer' } }),
    prisma.position.create({ data: { name: 'Designer' } }),
    prisma.position.create({ data: { name: 'QA Engineer' } }),
  ]);

  const getPos = (name: string) => positions.find(p => p.name === name)!.id;
  const getTeam = (name: string) => teams.find(t => t.name === name)!.id;

  const password = await bcrypt.hash('password123', 10);

  console.log('Seeding employees...');
  
  // 1. CEO
  const ceo = await prisma.user.create({
    data: {
      email: 'ceo@example.com',
      password,
      role: Role.ADMIN,
      firstName: 'Alice',
      lastName: 'Leader',
      sex: 'Female',
      dateOfBirth: new Date('1980-05-15'),
      address: '1 CEO Way, San Francisco',
      positionId: getPos('CEO'),
    }
  });

  // 2. Managers (Reporting to CEO)
  const cto = await prisma.user.create({
    data: {
      email: 'cto@example.com',
      password,
      role: Role.ADMIN,
      firstName: 'Bob',
      lastName: 'Tech',
      sex: 'Male',
      dateOfBirth: new Date('1985-08-20'),
      address: '2 Tech Blvd, San Jose',
      positionId: getPos('CTO'),
      teamId: getTeam('Engineering'),
      managerId: ceo.id,
    }
  });

  const cmo = await prisma.user.create({
    data: {
      email: 'cmo@example.com',
      password,
      role: Role.EDITOR,
      firstName: 'Carol',
      lastName: 'Market',
      sex: 'Female',
      dateOfBirth: new Date('1988-03-10'),
      address: '3 Ads St, New York',
      positionId: getPos('CMO'),
      teamId: getTeam('Marketing'),
      managerId: ceo.id,
    }
  });

  const hrm = await prisma.user.create({
    data: {
      email: 'hr@example.com',
      password,
      role: Role.EDITOR,
      firstName: 'Dave',
      lastName: 'People',
      sex: 'Male',
      dateOfBirth: new Date('1990-11-25'),
      address: '4 People Sq, London',
      positionId: getPos('HR Manager'),
      teamId: getTeam('Human Resources'),
      managerId: ceo.id,
    }
  });

  // 3. Individual Contributors
  const devData = [
    { first: 'Eve', last: 'Coder', pos: 'Senior Developer', team: 'Engineering' },
    { first: 'Frank', last: 'Smith', pos: 'Senior Developer', team: 'Engineering' },
    { first: 'Grace', last: 'Hopper', pos: 'Junior Developer', team: 'Engineering' },
    { first: 'Heidi', last: 'Bug', pos: 'QA Engineer', team: 'Engineering' },
    { first: 'Ivan', last: 'Script', pos: 'Junior Developer', team: 'Engineering' },
  ];

  for (const d of devData) {
    await prisma.user.create({
      data: {
        email: `${d.first.toLowerCase()}@example.com`,
        password,
        role: Role.READER,
        firstName: d.first,
        lastName: d.last,
        sex: Math.random() > 0.5 ? 'Female' : 'Male',
        dateOfBirth: new Date('1995-01-01'),
        address: 'Engineering Hub',
        positionId: getPos(d.pos),
        teamId: getTeam(d.team),
        managerId: cto.id,
      }
    });
  }

  const marketData = [
    { first: 'Judy', last: 'Ads', pos: 'Designer', team: 'Marketing' },
    { first: 'Kevin', last: 'Social', pos: 'Designer', team: 'Marketing' },
    { first: 'Laura', last: 'Content', pos: 'Designer', team: 'Marketing' },
  ];

  for (const d of marketData) {
    await prisma.user.create({
      data: {
        email: `${d.first.toLowerCase()}@example.com`,
        password,
        role: Role.READER,
        firstName: d.first,
        lastName: d.last,
        sex: 'Female',
        dateOfBirth: new Date('1996-01-01'),
        address: 'Marketing Office',
        positionId: getPos(d.pos),
        teamId: getTeam(d.team),
        managerId: cmo.id,
      }
    });
  }

  // HR Staff
  for (let i = 1; i <= 8; i++) {
    await prisma.user.create({
      data: {
        email: `staff${i}@example.com`,
        password,
        role: Role.READER,
        firstName: `Staff${i}`,
        lastName: `Employee`,
        sex: i % 2 === 0 ? 'Male' : 'Female',
        dateOfBirth: new Date('1992-01-01'),
        address: 'HQ',
        positionId: getPos('QA Engineer'), // Just reusable ID
        teamId: getTeam('Human Resources'),
        managerId: hrm.id,
      }
    });
  }

  console.log('Seeding completed! Created 20 employees across 3 teams.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
