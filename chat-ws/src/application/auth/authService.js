import jwt from 'jsonwebtoken';

const users = [];
const SECRET = process.env.JWT_SECRET || 'supersecretkey';

export function registerUser(username, password) {
  if (users.find(u => u.username === username)) {
    return { error: 'User already exists' };
  }
  users.push({ username, password });
  return { success: true };
}

export function authenticateUser(username, password) {
  const user = users.find(u => u.username === username && u.password === password);
  if (!user) return null;
  // Generate JWT
  const token = jwt.sign({ username }, SECRET, { expiresIn: '1h' });
  return token;
}

export function verifyToken(token) {
  try {
    return jwt.verify(token, SECRET);
  } catch (err) {
    return null;
  }
}
