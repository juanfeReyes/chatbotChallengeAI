import * as  express from 'express';
import * as authService from '../../application/auth/authService.js';
import { getChatCompletion, getChatCompletionWithContext } from '../../application/chat/llmService.js';
import productsList from '../assets/beachFashionProducts.json' with { type: 'json' };
import {authenticateJWT} from './authRouter.js'


const router = express.Router();

// Protected chat route
router.post('/chat', authenticateJWT, async (req, res) => {
  const { message } = req.body;
  const token = req.cookies.jwtToken;
  const payload = authService.verifyToken(token);
  if (!message) {
    return res.status(400).json({ error: 'Message is required' });
  }
  try {
    const reply = await getChatCompletionWithContext(message, payload.chatToken);
    res.json({ reply });
  } catch (err) {
    console.error('Error getting chat completion:', err);
    res.status(500).json({ error: err.message });
  }
});

router.get('/healthcheck', (req, res) => {
  const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
  if (!OPENAI_API_KEY) {
    return res.status(500).json({ error: 'OpenAI not configured correctly' });
  }

  res.status(200).json({ status: 'OK' });
});

// Example route
router.get('/', (req, res) => {
  res.send('Hello World from Express!');
});


// GET /products endpoint
router.get('/products', (req, res) => {
  console.log()
  res.json(productsList);
});

export default router;