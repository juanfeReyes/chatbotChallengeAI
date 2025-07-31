import * as  express from 'express';
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import passport from 'passport';
import * as authService from '../../application/auth/authService.js';

const authRouter = express.Router();

// Register route
authRouter.post('/register', (req, res) => {
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
authRouter.post('/login', (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ error: 'Username and password are required' });
  }
  const token = authService.authenticateUser(username, password);
  if (!token) {
    return res.status(400).json({ error: 'Invalid login' });
  }
  res.cookie('jwtToken', token)
  res.redirect('/');
});


// Middleware to protect routes
export function authenticateJWT(req, res, next) {
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

authRouter.get('/google',
  passport.authenticate('google', { scope: ['profile', 'email'] }));

authRouter.get('/google/callback',
  passport.authenticate('google', { failureRedirect: '/login', session: false }),
  function (req, res) {
    const token = authService.authenticateUser(req.user.emails[0].value, 'test');
    res.cookie('jwtToken', token)
    res.redirect('/');
  });

  export default authRouter;
