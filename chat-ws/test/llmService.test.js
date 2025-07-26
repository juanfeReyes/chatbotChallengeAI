const { getChatCompletion } = require('../services/llmService');

jest.mock('openai', () => {
  return {
    OpenAI: jest.fn().mockImplementation(() => ({
      chat: {
        completions: {
          create: jest.fn(({ model, messages }) => {
            if (!messages || !messages[1] || !messages[1].content) {
              throw new Error('Message is required');
            }
            return Promise.resolve({
              choices: [{ message: { content: 'Mocked response' } }],
            });
          }),
        },
      },
    })),
  };
});

describe('llmService', () => {
  it('should return a chat completion', async () => {
    const result = await getChatCompletion('Hello');
    expect(result).toBe('Mocked response');
  });

  it('should throw error if message is missing', async () => {
    await expect(getChatCompletion()).rejects.toThrow('Message is required');
  });
});
