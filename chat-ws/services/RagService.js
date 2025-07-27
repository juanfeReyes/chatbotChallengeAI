import { OpenAIEmbeddings } from '@langchain/openai'
import { MemoryVectorStore } from "langchain/vectorstores/memory";
import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters"

import { createHistoryAwareRetriever } from "langchain/chains/history_aware_retriever"
import { ChatPromptTemplate, MessagesPlaceholder } from "@langchain/core/prompts"
import { createStuffDocumentsChain } from "langchain/chains/combine_documents"
import { createRetrievalChain } from "langchain/chains/retrieval"
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import { ChatOpenAI } from '@langchain/openai';
import { JSONLoader } from "langchain/document_loaders/fs/json";

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

let vectorStore = new MemoryVectorStore();
export let ragChain = null;

export async function buildInMemoryVectorStore() {
  const documents = await loadDocumentFromAssets('productsData.json');
  const splitDocs = await splitDocument(documents);
  await storeEmbeddings(splitDocs);
  console.log("In-memory vector store built successfully", vectorStore);
};

async function loadDocumentFromAssets(fileName) {
  const __dirname = process.cwd();
  const loader = new JSONLoader(__dirname + '/assets/' + fileName);
  return await loader.load();
}

/**
 * 
 * @param {*} document String representing the document to be split 
 */
async function splitDocument(document) {
  const splitter = new RecursiveCharacterTextSplitter({
    chunkSize: 1000, // TODO: make configurable
    chunkOverlap: 200, // TODO: make configurable
  });

  return await splitter.splitDocuments(document);
}

async function storeEmbeddings(splits) {
  vectorStore = await MemoryVectorStore.fromDocuments(
    splits,
    new OpenAIEmbeddings({
      model: "text-embedding-3-small",
      apiKey: OPENAI_API_KEY
    })
  );
}

export async function buildQaChain(k = 5) {
  const llm = new ChatOpenAI({
    model: 'gpt-3.5-turbo', //make configurable
    temperature: 0.0, // make configurable
    openAIApiKey: OPENAI_API_KEY,
  })
  const contextualizeQuestionSystemPromt = "You are a helpful and polite assistant"; // Make this configurable
  const promptWithContext = ChatPromptTemplate.fromMessages([
    ["system", contextualizeQuestionSystemPromt], //please update with the business context
    new MessagesPlaceholder('chat_history'),
    ["human", "{input}"],
  ])

  const retriever = vectorStore.asRetriever()

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
  ragChain = chain;
  console.log("RAG Chain built successfully", ragChain);
}

