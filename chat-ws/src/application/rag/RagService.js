import { HumanMessage, ToolMessage, SystemMessage, AIMessage } from '@langchain/core/messages';
import { StateGraph, MemorySaver, MessagesAnnotation, Annotation } from '@langchain/langgraph';
import { VectorStore } from './vectorStore.js';
import { ChatModel } from '../../infrastructure/models/chatmodel.js';
import { tool } from '@langchain/core/tools';
import { z } from "zod";
import { ToolNode, toolsCondition } from "@langchain/langgraph/prebuilt";


async function buildRagWorkflow() {
  const retrieveSchema = z.object({ query: z.string() });

  const retrieve = tool(async ({ query }) => {
    const retrievedDocs = await (await VectorStore.getStore()).similaritySearch(query, 2)
    const serialized = retrievedDocs
      .map(
        (doc) => `Source: ${doc.metadata.source}\nContent: ${doc.pageContent}`
      )
      .join("\n");
    return [serialized, retrievedDocs];
  },
    {
      name: "retrieve",
      description: "Retrieve information related to outfit recommendation for the beach.",
      schema: retrieveSchema,
      responseFormat: "content_and_artifact",
      verbose: true
    }
  )

  async function queryOrRespond(state) {
    const llm = await ChatModel.getModel();
    const llmWithTools = llm.bindTools([retrieve]);
    const response = await llmWithTools.invoke(state.messages);
    return { messages: [response] };
  }

  const tools = new ToolNode([retrieve]);

  const generate = async (state) => {
    let recentToolMessages = [];
    for (let i = state["messages"].length - 1; i >= 0; i--) {
      let message = state["messages"][i];
      if (message instanceof ToolMessage) {
        recentToolMessages.push(message);
      } else {
        break;
      }
    }
    let toolMessages = recentToolMessages.reverse();

    // Format into prompt
    const docsContent = toolMessages.map((doc) => doc.content).join("\n");
    const systemMessageContent =
      `You are a very polite fashion assistan for aswerin question regarding 
      recommendations for going to the beach. If you don't know the answer, say that you " +
      "don't know. Use three sentences maximum and keep the " +
      "answer concise.` +
      "\n\n" +
      `${docsContent}`;

    const conversationMessages = state.messages.filter(
      (message) =>
        message instanceof HumanMessage ||
        message instanceof SystemMessage ||
        (message instanceof AIMessage && message.tool_calls.length == 0)
    );
    const prompt = [
      new SystemMessage(systemMessageContent),
      ...conversationMessages,
    ];

    // Run
    const llm = await ChatModel.getModel()
    const response = await llm.invoke(prompt);
    return { messages: [response] };
  }

  const saluteOrDontKnow = async (state) => {
    const systemMessageContent =
      `Please say Hi to the user if the user if greeting you else please say 
      that you dont know and ask if you can help any other way`;
    const humanMessages = state.messages.filter(msg => msg instanceof HumanMessage)
    const lastHumanMessage = humanMessages[humanMessages.length - 1]
    const prompt = [
      new SystemMessage(systemMessageContent),
      new HumanMessage(lastHumanMessage)
    ];

    // Run
    const llm = await ChatModel.getModel()
    const response = await llm.invoke(prompt);
    return { messages: [response] };
  }

  function shouldContinue({ messages }) {
  const lastMessage = messages[messages.length - 1] ;

  // If the LLM makes a tool call, then we route to the "tools" node
  if (lastMessage.tool_calls?.length) {
    return "tools";
  }
  // Otherwise, we stop (reply to the user) using the special "__end__" node
  return "saluteOrDontKnow";
}

  const checkpointer = new MemorySaver();
  const graph = new StateGraph(MessagesAnnotation)
    .addNode("queryOrRespond", queryOrRespond)
    .addNode("tools", tools)
    .addNode("generate", generate)
    .addNode("saluteOrDontKnow", saluteOrDontKnow)
    .addEdge("__start__", "queryOrRespond")
    .addConditionalEdges("queryOrRespond", shouldContinue)
    // .addConditionalEdges("queryOrRespond", toolsCondition, {
    //   saluteOrDontKnow: "saluteOrDontKnow",
    //   tools: "tools",
    //   __end__: "__end__"
    // })
    .addEdge("tools", "generate")
    .addEdge("generate", "__end__")
    .addEdge("saluteOrDontKnow", "__end__")
    .compile({ checkpointer });

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
