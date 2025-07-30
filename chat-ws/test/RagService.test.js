import * as RagServiceModule from '../src/application/rag/RagService.js';
import { VectorStore } from '../src/application/rag/vectorStore.js';
import { ChatModel } from '../src/infrastructure/models/chatmodel.js';

jest.mock('../src/application/rag/vectorStore.js', () => ({
  VectorStore: {
    getStore: jest.fn(async () => ({
      similaritySearch: jest.fn(async (query, n) => [
        { metadata: { source: 'source1' }, pageContent: 'content1' },
        { metadata: { source: 'source2' }, pageContent: 'content2' }
      ])
    }))
  }
}));
jest.mock('../src/infrastructure/models/chatmodel.js', () => ({
  ChatModel: {
    getModel: jest.fn(async () => ({
      bindTools: jest.fn(function (tools) {
        return {
          invoke: jest.fn(async (messages) => ({ type: 'toolResponse', messages }))
        };
      }),
      invoke: jest.fn(async (prompt) => ({ type: 'llmResponse', prompt }))
    }))
  }
}));

describe('WorkflowApp', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should build and return a workflow graph', async () => {
    const workflow = await RagServiceModule.WorkflowApp.getWorkflow();
    expect(workflow).toBeDefined();
  });

  it('should return the same workflow instance on subsequent calls', async () => {
    const wf1 = await RagServiceModule.WorkflowApp.getWorkflow();
    const wf2 = await RagServiceModule.WorkflowApp.getWorkflow();
    expect(wf1).toBe(wf2);
  });
});

