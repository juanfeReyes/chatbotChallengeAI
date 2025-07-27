import * as  express from 'express';
import * as authService from '../../application/auth/authService.js';
import { getChatCompletion } from '../../application/chat/llmService.js';

const router = express.Router();

// Register route
router.post('/register', (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ error: 'Username and password are required' });
  }
  const result = authService.registerUser(username, password);
  if (result.error) {
    return res.status(400).json({ error: result.error });
  }
  res.status(201).json({ message: 'User registered successfully' });
});

// Login route
router.post('/login', (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ error: 'Username and password are required' });
  }
  const token = authService.authenticateUser(username, password);
  if (!token) {
    return res.status(400).json({ error: 'Invalid login' });
  }
  res.json({ token });
});

// Middleware to protect routes
function authenticateJWT(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  const payload = authService.verifyToken(token);
  if (!payload) {
    return res.status(401).json({ error: 'Invalid token' });
  }
  req.user = payload;
  next();
}

// Protected chat route
router.post('/chat', authenticateJWT, async (req, res) => {
  const { message } = req.body;
  if (!message) {
    return res.status(400).json({ error: 'Message is required' });
  }
  try {
    const reply = await getChatCompletion(message);
    res.json({ reply });
  } catch (err) {
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

export default router;

// GET /products endpoint
router.get('/products', (req, res) => {
  const products = [
    'Laptop',
    'Smartphone',
    'Headphones',
    'Keyboard',
    'Monitor'
  ];
  res.json(products);
});
