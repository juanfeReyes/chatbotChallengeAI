const { OpenAI } = require('openai');

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const openai = new OpenAI({ apiKey: OPENAI_API_KEY });

async function getChatCompletion(message) {
  const response = await openai.chat.completions.create({
    model: 'gpt-3.5-turbo',
    messages: [
      { role: 'system', content: 'You are a helpful and polite assistant' }, //please update with the business context
      { role: 'user', content: message }
    ],
  });
  return response.choices[0].message.content;
}

module.exports = { getChatCompletion };
