import express from 'express';
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
const app = express();
const PORT = process.env.CHATWS_PORT || 8080;
import apiRouter from './src/infrastructure/api/apiRouter.js';
import {VectorStore} from './src/application/rag/vectorStore.js'
import passport from 'passport';

async function initApp() {
  try {
    console.info("Starting chat-ws server...");
    await VectorStore.getStore()
  } catch (error) {
    console.error("Error initializing chat-ws server:", error);
    // process.exit(1); // Exit the process with an error code
  }
}

const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;
passport.use(new GoogleStrategy({
    clientID: GOOGLE_CLIENT_ID,
    clientSecret: GOOGLE_CLIENT_SECRET,
    callbackURL: "http://localhost:8080/api/v1/auth/google/callback"
  },
  function(accessToken, refreshToken, profile, cb) {
    // Here you would find or create a user in your database
    return cb(null, profile);
  }
));

app.get('/api/v1/auth/google',
  passport.authenticate('google', { scope: ['profile', 'email'] }));

app.get('/api/v1/auth/google/callback', 
  passport.authenticate('google', { failureRedirect: '/login', session: false }),
  function(req, res) {
    // Successful authentication, redirect home.
    res.redirect('/');
  });

// Middleware
app.use(express.json());
app.use(express.static('assets'));


// Routes
app.use('/api/v1', apiRouter);
const __dirname = process.cwd();
app.use(express.static(__dirname+ '/src/infrastructure/pages/client'));

initApp().then(() => {

  // Start server
  app.listen(PORT, () => {
    console.info(`Server running on port ${PORT}`);
  });
})


