import { OpenAI } from 'openai';
import { WorkflowApp } from '../rag/RagService.js';
import { isAIMessage } from "@langchain/core/messages";

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const openai = new OpenAI({ apiKey: OPENAI_API_KEY });

export async function getChatCompletionWithContext(message, chatId){
  const app = await WorkflowApp.getWorkflow()

  const inputs = {messages: [{role: 'user', content: message}]};
  const stream = await app.stream(inputs, {streamMode: 'values', configurable: { thread_id: chatId }});
  const messages = [];
  for await (const value of stream) {
    const lastMessage = value.messages[value.messages.length - 1];
    
    if(isAIMessage(lastMessage)){
      messages.push(lastMessage.content);
    }
  }
  console.debug("Final messages:", messages);
  return messages[messages.length - 1]; // Return the last message content
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

