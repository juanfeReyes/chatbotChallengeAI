const express = require('express');
const app = express();
const PORT = process.env.CHATWS_PORT || 8080;

// Middleware
app.use(express.json());
app.use(express.static('assets'));

// Routes
const mainRouter = require('./routes/main');
app.use('/', mainRouter);

// Start server
app.listen(PORT, () => {
  console.info(`Server running on port ${PORT}`);
});

console.info("Starting chat-ws server...");
