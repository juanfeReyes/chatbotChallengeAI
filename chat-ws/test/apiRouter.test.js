import request from 'supertest';
import express from 'express';
jest.mock('../src/application/chat/llmService.js', () => ({
  getChatCompletionWithContext: jest.fn(async (msg) => {
    if (!msg) throw new Error('Message is required');
    if (msg === 'error') throw new Error('OpenAI API key not configured');
    return 'Mocked LLM reply';
  })
}));
import apiRouter from '../src/infrastructure/api/apiRouter.js';

const app = express();
app.use(express.json());
app.use('/', apiRouter);

describe('Auth and Chat Routes', () => {
  describe('POST /register', () => {
    it('should register a new user', async () => {
      const res = await request(app)
        .post('/register')
        .send({ username: 'testuser', password: 'testpass' });
      expect(res.statusCode).toBe(201);
      expect(res.body.message).toBe('User registered successfully');
    });
    it('should not register with missing fields', async () => {
      const res = await request(app)
        .post('/register')
        .send({ username: '' });
      expect(res.statusCode).toBe(400);
      expect(res.body.error).toBe('Username and password are required');
    });
    it('should not register an existing user', async () => {
      await request(app).post('/register').send({ username: 'dupe', password: 'pass' });
      const res = await request(app).post('/register').send({ username: 'dupe', password: 'pass' });
      expect(res.statusCode).toBe(400);
      expect(res.body.error).toBe('User already exists');
    });
  });

  describe('POST /login', () => {
    beforeAll(async () => {
      await request(app).post('/register').send({ username: 'loginuser', password: 'loginpass' });
    });
    it('should login with valid credentials', async () => {
      const res = await request(app)
        .post('/login')
        .send({ username: 'loginuser', password: 'loginpass' });
      expect(res.statusCode).toBe(200);
      expect(res.body.token).toBeDefined();
    });
    it('should not login with invalid credentials', async () => {
      const res = await request(app)
        .post('/login')
        .send({ username: 'loginuser', password: 'wrongpass' });
      expect(res.statusCode).toBe(400);
      expect(res.body.error).toBe('Invalid login');
    });
    it('should not login with unregistered user', async () => {
      const res = await request(app)
        .post('/login')
        .send({ username: 'nouser', password: 'nopass' });
      expect(res.statusCode).toBe(400);
      expect(res.body.error).toBe('Invalid login');
    });
  });

  describe('POST /chat', () => {
    let token;
    beforeAll(async () => {
      await request(app).post('/register').send({ username: 'chatuser', password: 'chatpass' });
      const res = await request(app).post('/login').send({ username: 'chatuser', password: 'chatpass' });
      token = res.body.token;
    });
    it('should deny access without token', async () => {
      const res = await request(app).post('/chat').send({ message: 'Hello' });
      expect(res.statusCode).toBe(401);
      expect(res.body.error).toBe('Unauthorized');
    });
    it('should deny access with invalid token', async () => {
      const res = await request(app)
        .post('/chat')
        .set('Authorization', 'Bearer invalidtoken')
        .send({ message: 'Hello' });
      expect(res.statusCode).toBe(401);
      expect(res.body.error).toBe('Invalid token');
    });
    it('should return error if message is missing', async () => {
      const res = await request(app)
        .post('/chat')
        .set('Authorization', `Bearer ${token}`)
        .send({});
      expect(res.statusCode).toBe(400);
      expect(res.body.error).toBe('Message is required');
    });
    it('should return error if llmService throws', async () => {
      const res = await request(app)
        .post('/chat')
        .set('Authorization', `Bearer ${token}`)
        .send({ message: 'error' });
      expect(res.statusCode).toBe(500);
      expect(res.body.error).toBe('OpenAI API key not configured');
    });
    it('should allow access with valid token and return LLM reply', async () => {
      const res = await request(app)
        .post('/chat')
        .set('Authorization', `Bearer ${token}`)
        .send({ message: 'Hello' });
      expect(res.statusCode).toBe(200);
      expect(res.body.reply).toBe('Mocked LLM reply');
    });
  });
});
