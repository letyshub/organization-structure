import request from 'supertest';
import { app, prisma } from '../src/index';

describe('RBAC & CRUD API', () => {
  let adminToken: string;
  let readerToken: string;

  beforeAll(async () => {
    await prisma.user.deleteMany();
    await prisma.position.deleteMany();

    // Create Admin
    const adminRes = await request(app)
      .post('/api/auth/register')
      .send({
        email: 'admin@example.com',
        password: 'password',
        role: 'ADMIN',
        firstName: 'Admin',
        lastName: 'User',
        sex: 'Other',
        dateOfBirth: '1980-01-01',
        address: 'Admin St'
      });
    adminToken = adminRes.body.token;

    // Create Reader
    const readerRes = await request(app)
      .post('/api/auth/register')
      .send({
        email: 'reader@example.com',
        password: 'password',
        role: 'READER',
        firstName: 'Reader',
        lastName: 'User',
        sex: 'Other',
        dateOfBirth: '1995-01-01',
        address: 'Reader St'
      });
    readerToken = readerRes.body.token;
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  it('should allow Admin to create a position', async () => {
    const res = await request(app)
      .post('/api/positions')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ name: 'CEO' });
    
    expect(res.status).toBe(201);
    expect(res.body.name).toBe('CEO');
  });

  it('should deny Reader from creating a position', async () => {
    const res = await request(app)
      .post('/api/positions')
      .set('Authorization', `Bearer ${readerToken}`)
      .send({ name: 'CTO' });
    
    expect(res.status).toBe(403);
  });

  it('should allow Reader to search users', async () => {
    const res = await request(app)
      .get('/api/users')
      .set('Authorization', `Bearer ${readerToken}`);
    
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });
});
