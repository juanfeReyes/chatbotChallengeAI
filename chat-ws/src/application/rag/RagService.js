import { HumanMessage } from '@langchain/core/messages';
import { StateGraph, START, END, MemorySaver, MessagesAnnotation, Annotation } from '@langchain/langgraph';
import { QaChain } from "./qaChain.js";
import { pull } from 'langchain/hub';
import { ChatPromptTemplate } from '@langchain/core/prompts';
import { VectorStore } from './vectorStore.js';
import { ChatModel } from '../../infrastructure/models/chatmodel.js';



async function callModel(state) {
  const response = await (await QaChain.getChain()).invoke(state);
  return {
    chat_history: [
      new HumanMessage(state.input),
      new AIMessage(response.answer),
    ],
    context: response.context,
    answer: response.answer,
  }
}

async function buildRagWorkflow() {
  const promptTemplate = await pull('rlm/rag-prompt');

  const retrieve = async (state) => {
  const retrievedDocs = await (await VectorStore.getStore()).similaritySearch(state.question)
  return { context: retrievedDocs };
}

const generate = async (state) => {
  const docsContent = state.context.map(doc => doc.pageContent).join('\n');
  const messages = await promptTemplate.invoke({question: state.question, context: docsContent});
  const response = await (await ChatModel.getModel()).invoke(messages);
  return { answer: response.content };
}
 
  const StateAnnotation = Annotation.Root({
    question: Annotation,
    context: Annotation,
    answer: Annotation
  })

  const graph = new StateGraph(StateAnnotation)
  .addNode("retrieve", retrieve)
  .addNode("generate", generate)
  .addEdge("__start__", "retrieve")
  .addEdge("retrieve", "generate")
  .addEdge("generate", "__end__")
  .compile();
  return graph;
}

export const WorkflowApp = (function () {

  let workflow;

  return {
    getWorkflow: async function () {
      if (!workflow) {
        workflow = await buildRagWorkflow();
      }
      return workflow;
    }
  }
})();
