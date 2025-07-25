
jest.mock('../services/llmService', () => ({
  getChatCompletion: jest.fn(async () => 'Mocked LLM reply')
}));

const request = require('supertest');
const express = require('express');
const apiRouter = require('../routes/apiRouter');

describe('Healthcheck Endpoint', () => {
  let app;
  beforeEach(() => {
    app = express();
    app.use(express.json());
    app.use('/api/v1', apiRouter);
  });

  it('should return OK when OPENAI_API_KEY is set', async () => {
    process.env.OPENAI_API_KEY = 'test-key';
    const res = await request(app).get('/api/v1/healthcheck');
    expect(res.statusCode).toBe(200);
    expect(res.body.status).toBe('OK');
  });

  it('should return error when OPENAI_API_KEY is missing', async () => {
    delete process.env.OPENAI_API_KEY;
    const res = await request(app).get('/api/v1/healthcheck');
    expect(res.statusCode).toBe(500);
    expect(res.body.error).toBe('OpenAI not configured correctly');
  });
});
