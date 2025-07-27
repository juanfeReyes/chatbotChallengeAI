import { ChatOpenAI } from '@langchain/openai';

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const MODEL_NAME = process.env.OPENAI_MODEL || 'gpt-3.5-turbo';
const TEMPERATURE = process.env.OPENAI_TEMPERATURE ? parseFloat(process.env.OPENAI_TEMPERATURE) : 0.0;

const openAPImodel = new ChatOpenAI({
    model: MODEL_NAME,
    temperature: TEMPERATURE,
    openAIApiKey: OPENAI_API_KEY,
});

const getChatModel = () => {
  const model = null;

  if (model == null) {
    model = openAPImodel
  }

  return model;
}

const chatModel = Object.freeze(getChatModel());

export default chatModel;