import express from 'express';
const app = express();
const PORT = process.env.CHATWS_PORT || 8080;
import apiRouter from './src/infrastructure/api/apiRouter.js';
import authRouter from './src/infrastructure/api/authRouter.js';
import { VectorStore } from './src/application/rag/vectorStore.js'
import cookieParser from 'cookie-parser';


async function initApp() {
  try {
    console.info("Starting chat-ws server...");
    await VectorStore.getStore()
  } catch (error) {
    console.error("Error initializing chat-ws integrations", error);
    // process.exit(1); // Exit the process with an error code
  }
}

// Middleware
app.use(cookieParser())
app.use(express.json());
app.use(express.static('assets'));


// Routes
app.use('/api/v1', apiRouter);
app.use('/api/v1/auth', authRouter);
const __dirname = process.cwd();
app.use(express.static(__dirname + '/src/infrastructure/pages/client'));

initApp()
app.listen(PORT, () => {
  console.info(`Server running on port ${PORT}`);
});


