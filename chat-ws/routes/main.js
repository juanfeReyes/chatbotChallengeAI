const express = require('express');
const router = express.Router();

// Example route
router.get('/', (req, res) => {
  res.send('Hello World from Express!');
});

module.exports = router;
