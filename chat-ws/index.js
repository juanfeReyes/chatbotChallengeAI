import express from 'express';
const app = express();
const PORT = process.env.CHATWS_PORT || 8080;
import apiRouter from './src/infrastructure/api/apiRouter.js';
import {VectorStore} from './src/application/rag/vectorStore.js'
import {QaChain} from './src/application/rag/qaChain.js'


async function initApp() {
  try {
    console.info("Starting chat-ws server...");
    await VectorStore.getStore()
    await QaChain.getChain();
  } catch (error) {
    console.error("Error initializing chat-ws server:", error);
    // process.exit(1); // Exit the process with an error code
  }
}

// Middleware
app.use(express.json());
app.use(express.static('assets'));

// Routes
app.use('/api/v1', apiRouter);

initApp().then(() => {

  // Start server
  app.listen(PORT, () => {
    console.info(`Server running on port ${PORT}`);
  });
})


