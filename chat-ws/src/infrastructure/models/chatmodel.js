import { ChatOpenAI } from '@langchain/openai';

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const MODEL_NAME = process.env.OPENAI_MODEL || 'gpt-3.5-turbo';
const TEMPERATURE = process.env.OPENAI_TEMPERATURE ? parseFloat(process.env.OPENAI_TEMPERATURE) : 0.0;

export const ChatModel = (function () {

  let model;

  return {
    getModel: async function () {
      if (!model) {
        model = new ChatOpenAI({
    model: MODEL_NAME,
    temperature: TEMPERATURE,
    openAIApiKey: OPENAI_API_KEY,
});  
      }
      return model;
    }
  }
})();
