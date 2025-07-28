import { OpenAIEmbeddings } from '@langchain/openai'

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const EMBEDDING_MODEL_NAME = process.env.OPENAI_MODEL || 'text-embedding-3-small';

export const EmbeddingModel = (function () {

  let model;

  return {
    getModel: async function () {
      if (!model) {
        model = new OpenAIEmbeddings({
          model: EMBEDDING_MODEL_NAME,
          apiKey: OPENAI_API_KEY
        });      
      }
      return model;
    }
  }
})();
