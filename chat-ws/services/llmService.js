import { OpenAI } from 'openai';
import { HumanMessage } from '@langchain/core/messages';
import { StateGraph, START, END, MemorySaver, MessagesAnnotation } from '@langchain/langgraph';
import { v4 as uuidv4 } from 'uuid';
import { ragChain } from './RagService.js';

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const openai = new OpenAI({ apiKey: OPENAI_API_KEY });

// How to execute async code at startup


// const GraphAnnotation = Annotation.Root({
//   input: Annotation(),
//   chat_history: Annotation({
//     redurecer: messagesStateReducer,
//     default: () => []
//   }),
//   context: Annotation(),
//   answer: Annotation(),
// })

async function callModel(state) {
  const response = ragChain.invoke(state)
  return {
    chat_history: [
      new HumanMessage(state.input),
      new AIMessage(response.answer),
    ],
    context: response.context,
    answer: response.answer,
  }
}

const workflow = new StateGraph(MessagesAnnotation)
  .addNode("model", callModel)
  .addEdge(START, "model")
  .addEdge("model", END);

const memory = new MemorySaver();
const app = workflow.compile({checkpointer: memory})

export async function getChatCompletionWithContext(){
  const threadId = uuidv4();
  const config = { configurable: { thread_id: threadId } };

  const result = await app.invoke(
    {input: message},
    config
  );
  console.info(`response from model: ->`, result)
  return result.answer;
}

export async function getChatCompletion(message) {
  const response = await openai.chat.completions.create({
    model: 'gpt-3.5-turbo',
    messages: [
      { role: 'system', content: 'You are a helpful and polite assistant' }, //please update with the business context
      { role: 'user', content: message }
    ],
  });
  return response.choices[0].message.content;
}

