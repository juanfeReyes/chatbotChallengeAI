import { MemoryVectorStore } from "langchain/vectorstores/memory";
import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters"

import { JSONLoader } from "langchain/document_loaders/fs/json";
import {EmbeddingModel} from '../../infrastructure/models/embeddingmodel.js';

export const VectorStore = (function() {

  let store;

  return {
    getStore: async function() {
      if (!store) {
        store = await buildInMemoryVectorStore();
      }
      return store;
    }
  }
})();


async function buildInMemoryVectorStore() {
  const documents = await loadDocumentFromAssets('productsData.json');
  const splitDocs = await splitDocument(documents);
  const vectorStore = await storeEmbeddings(splitDocs);
  console.log("In-memory vector store built successfully");
  return vectorStore;
};

async function loadDocumentFromAssets(fileName) {
  const __dirname = process.cwd();
  const loader = new JSONLoader(__dirname + '/src/infrastructure/assets/' + fileName);
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
  const embeddingModel = await EmbeddingModel.getModel();
  return await MemoryVectorStore.fromDocuments(
    splits,
    embeddingModel
  );
}