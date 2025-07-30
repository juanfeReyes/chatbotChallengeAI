import * as vectorStoreModule from '../src/application/rag/vectorStore.js';
import { MemoryVectorStore } from 'langchain/vectorstores/memory';
import { EmbeddingModel } from '../src/infrastructure/models/embeddingmodel.js';

jest.mock('langchain/vectorstores/memory', () => ({
  MemoryVectorStore: {
    fromDocuments: jest.fn(async (docs, model) => ({ docs, model, type: 'mockedVectorStore' }))
  }
}));
jest.mock('../src/infrastructure/models/embeddingmodel.js', () => ({
  EmbeddingModel: {
    getModel: jest.fn(async () => 'mockedEmbeddingModel')
  }
}));
jest.mock('langchain/document_loaders/fs/json', () => ({
  JSONLoader: jest.fn().mockImplementation(() => ({
    load: jest.fn(async () => [{ pageContent: 'test content' }])
  }))
}));
jest.mock('@langchain/textsplitters', () => ({
  RecursiveCharacterTextSplitter: jest.fn().mockImplementation(() => ({
    splitDocuments: jest.fn(async (docs) => docs.map(doc => ({ ...doc, split: true })))
  }))
}));

describe('VectorStore', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should build and return a vector store', async () => {
    const store = await vectorStoreModule.VectorStore.getStore();
    expect(store).toBeDefined();
    expect(store.type).toBe('mockedVectorStore');
    expect(store.docs[0]).toHaveProperty('split', true);
    expect(store.model).toBe('mockedEmbeddingModel');
  });

  it('should return the same store instance on subsequent calls', async () => {
    const store1 = await vectorStoreModule.VectorStore.getStore();
    const store2 = await vectorStoreModule.VectorStore.getStore();
    expect(store1).toBe(store2);
  });
});

describe('buildInMemoryVectorStore', () => {
  it('should build a vector store with split documents and embeddings', async () => {
    const store = await vectorStoreModule.VectorStore.getStore();
    expect(store.docs[0]).toHaveProperty('split', true);
    expect(store.model).toBe('mockedEmbeddingModel');
  });
});

describe('splitDocument', () => {
  it('should split documents using RecursiveCharacterTextSplitter', async () => {
    const docs = [{ pageContent: 'test content' }];
    const result = await vectorStoreModule.splitDocument(docs);
    expect(result[0]).toHaveProperty('split', true);
  });
});

describe('storeEmbeddings', () => {
  it('should store embeddings using MemoryVectorStore', async () => {
    const splits = [{ pageContent: 'split content', split: true }];
    const result = await vectorStoreModule.storeEmbeddings(splits);
    expect(result.type).toBe('mockedVectorStore');
    expect(result.model).toBe('mockedEmbeddingModel');
  });
});
