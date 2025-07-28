import { OpenAI } from 'openai';
import { v4 as uuidv4 } from 'uuid';
import { WorkflowApp } from '../rag/RagService.js';

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const openai = new OpenAI({ apiKey: OPENAI_API_KEY });


export async function getChatCompletionWithContext(message){
  const threadId = uuidv4(); // how to handle this thread sessopm
  const config = { configurable: { thread_id: threadId } };
  const app = await WorkflowApp.getWorkflow()

  const inputs = {question: message}
  const result = await app.invoke(inputs);
  return result.answer;
}

export async function getChatCompletion(message) {
  const response = await openai.chat.completions.create({
    model: 'gpt-3.5-turbo',
    messages: [
      { role: 'system', content: 'You are a helpful and polite assistant' }, //please update with the business context
      { role: 'user', content: message }
    ],
  });
  return response.choices[0].message.content;
}

