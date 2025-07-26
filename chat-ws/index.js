const express = require('express');
const app = express();
const PORT = process.env.CHATWS_PORT || 8080;

// Middleware
app.use(express.json());
app.use(express.static('assets'));

// Routes
const apiRouter = require('./routes/apiRouter');
app.use('/api/v1', apiRouter);

// Start server
app.listen(PORT, () => {
  console.info(`Server running on port ${PORT}`);
});

console.info("Starting chat-ws server...");
