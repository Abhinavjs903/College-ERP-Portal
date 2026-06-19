const request = require('supertest');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const app = require('../src/app');

let mongoServer;

const userData = {
  name: 'Test Student',
  email: 'student@college.edu',
  password: 'secret123',
};

beforeAll(async () => {
  process.env.JWT_SECRET = 'test-secret';
  process.env.JWT_EXPIRES_IN = '1h';
  mongoServer = await MongoMemoryServer.create();
  await mongoose.connect(mongoServer.getUri());
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

afterEach(async () => {
  const { collections } = mongoose.connection;
  await Promise.all(
    Object.values(collections).map((collection) => collection.deleteMany({}))
  );
});

const registerUser = () =>
  request(app).post('/api/auth/register').send(userData);

describe('Auth API', () => {
  test('register returns a token for a new user', async () => {
    const res = await registerUser();
    expect(res.statusCode).toBe(201);
    expect(res.body.token).toBeDefined();
    expect(res.body.user.email).toBe(userData.email);
    expect(res.body.user.password).toBeUndefined();
  });

  test('login with valid credentials returns a token', async () => {
    await registerUser();
    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: userData.email, password: userData.password });
    expect(res.statusCode).toBe(200);
    expect(res.body.token).toBeDefined();
  });

  test('login with invalid credentials is rejected', async () => {
    await registerUser();
    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: userData.email, password: 'wrongpassword' });
    expect(res.statusCode).toBe(401);
  });

  test('protected route grants access with a valid token', async () => {
    const reg = await registerUser();
    const res = await request(app)
      .get('/api/auth/me')
      .set('Authorization', `Bearer ${reg.body.token}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.user.email).toBe(userData.email);
  });

  test('protected route rejects a request with no token', async () => {
    const res = await request(app).get('/api/auth/me');
    expect(res.statusCode).toBe(401);
  });

  test('protected route rejects an invalid token', async () => {
    const res = await request(app)
      .get('/api/auth/me')
      .set('Authorization', 'Bearer not.a.valid.token');
    expect(res.statusCode).toBe(401);
  });
});
