import { ChatPromptTemplate, MessagesPlaceholder } from '@langchain/core/prompts';
import { ChatModel } from '../../infrastructure/models/chatmodel.js';
import {VectorStore} from './vectorStore.js';
import { createHistoryAwareRetriever } from 'langchain/chains/history_aware_retriever';
import { createStuffDocumentsChain } from 'langchain/chains/combine_documents';
import { createRetrievalChain } from 'langchain/chains/retrieval';

export const QaChain = (function() {

  let chain;

  return {
    getChain: async function() {
      if (!chain) {
        chain = await buildQaChain();
      }
      return chain;
    }
  }
})();

export async function buildQaChain(k = 5) {
  const llm = ChatModel.getModel();
  
  const contextualizeQuestionSystemPromt = "You are a helpful and polite assistant"; // Make this configurable
  const promptWithContext = ChatPromptTemplate.fromMessages([
    ["system", contextualizeQuestionSystemPromt], //please update with the business context
    new MessagesPlaceholder('chat_history'),
    ["human", "{input}"],
  ])

  const retriever = (await VectorStore.getStore()).asRetriever()

  const historyRetriver = await createHistoryAwareRetriever({
    llm: llm,
    retriever: retriever,
    rephrasePrompt: promptWithContext,
  });

  const systemPrompt =
    "You are a helpful and polite assistant" +
    "\n\n" +
    "{context}"; // Make this configurable

  const qaPrompt = ChatPromptTemplate.fromMessages([
    ["system", systemPrompt],
    new MessagesPlaceholder("chat_history"),
    ["human", "{input}"],
  ]);

  const questionAnswerChain = await createStuffDocumentsChain({
    llm: llm,
    prompt: qaPrompt,
  })

  const chain = await createRetrievalChain({
    retriever: historyRetriver,
    combineDocsChain: questionAnswerChain
  })
  console.log("RAG Chain built successfully");
  return chain;
}