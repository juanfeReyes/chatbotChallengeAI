import { HumanMessage } from '@langchain/core/messages';
import { StateGraph, START, END, MemorySaver, MessagesAnnotation } from '@langchain/langgraph';
import { QaChain } from "./qaChain.js";

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
  const workflow = new StateGraph(MessagesAnnotation)
    .addNode("model", callModel)
    .addEdge(START, "model")
    .addEdge("model", END);

  const memory = new MemorySaver();
  return workflow.compile({ checkpointer: memory })
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
