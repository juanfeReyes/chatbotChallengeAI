import jwt from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';

const users = [];
const SECRET = process.env.JWT_SECRET || 'supersecretkey';

export function registerUser(username, password) {
  if (users.find(u => u.username === username)) {
    return { error: 'User already exists' };
  }
  users.push({ username, password });
  return { success: true };
}

export const generateToken = (username) => {
  const chatToken = uuidv4();
  const token = jwt.sign({ username, chatToken }, SECRET, { expiresIn: '1h' });
  return token;
}

export function authenticateUser(username, password) {
  const user = users.find(u => u.username === username && u.password === password);
  if (!user) return null;
  // Generate JWT
  const token = generateToken(username)
  return token;
}

export function verifyToken(token) {
  try {
    return jwt.verify(token, SECRET);
  } catch (err) {
    return null;
  }
}
