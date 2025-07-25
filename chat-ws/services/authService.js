const users = [];
const jwt = require('jsonwebtoken');
const SECRET = process.env.JWT_SECRET || 'supersecretkey';

function registerUser(username, password) {
  if (users.find(u => u.username === username)) {
    return { error: 'User already exists' };
  }
  users.push({ username, password });
  return { success: true };
}

function authenticateUser(username, password) {
  const user = users.find(u => u.username === username && u.password === password);
  if (!user) return null;
  // Generate JWT
  const token = jwt.sign({ username }, SECRET, { expiresIn: '1h' });
  return token;
}

function verifyToken(token) {
  try {
    return jwt.verify(token, SECRET);
  } catch (err) {
    return null;
  }
}

module.exports = {
  registerUser,
  authenticateUser,
  verifyToken
};
