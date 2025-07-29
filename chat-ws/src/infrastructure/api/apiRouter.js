import * as  express from 'express';
import * as authService from '../../application/auth/authService.js';
import { getChatCompletion, getChatCompletionWithContext } from '../../application/chat/llmService.js';
import productsList from '../assets/beachFashionProducts.json' with { type: 'json' };
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import passport from 'passport';
import * as cookie from 'cookie'

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
  const cookieString = cookie.serialize('jwtToken', token, { httpOnly: true })
  res.setHeader('Set-Cookie', cookieString)
  if (!token) {
    return res.status(400).json({ error: 'Invalid login' });
  }
  res.json({ });
});


// Middleware to protect routes
function authenticateJWT(req, res, next) {
  const token = req.cookies.jwtToken;
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

const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID || 'test';
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET || 'test';
const GOOGLE_CALLBACK_URL = process.env.GOOGLE_CALLBACK_URL || "http://localhost:8080/api/v1/auth/google/callback"
passport.use(new GoogleStrategy({
  clientID: GOOGLE_CLIENT_ID,
  clientSecret: GOOGLE_CLIENT_SECRET,
  callbackURL: GOOGLE_CALLBACK_URL
},
  function (accessToken, refreshToken, profile, cb) {
    // Here you would find or create a user in your database
    authService.registerUser(profile.emails[0].value, 'test');
    return cb(null, profile);
  }
));

router.get('/auth/google',
  passport.authenticate('google', { scope: ['profile', 'email'] }));

router.get('/auth/google/callback',
  passport.authenticate('google', { failureRedirect: '/login', session: false }),
  function (req, res) {
    const token = authService.authenticateUser(req.user.emails[0].value, '');
    const cookieString = cookie.serialize('jwtToken', token, { httpOnly: true })
    res.setHeader('Set-Cookie', cookieString)
    res.redirect('/');
  });

export default router;