import {
  registerUser,
  authenticateUser,
  generateToken,
  verifyToken
} from '../src/application/auth/authService.js';

describe('authService', () => {
  beforeEach(() => {
    // Clear users array by resetting the module
    jest.resetModules();
  });

  describe('registerUser', () => {
    it('should register a new user', () => {
      const result = registerUser('user1', 'pass1');
      expect(result).toEqual({ success: true });
    });
    it('should not register an existing user', () => {
      registerUser('user2', 'pass2');
      const result = registerUser('user2', 'pass2');
      expect(result).toEqual({ error: 'User already exists' });
    });
  });

  describe('authenticateUser', () => {
    it('should authenticate valid user and return token', () => {
      registerUser('user3', 'pass3');
      const token = authenticateUser('user3', 'pass3');
      expect(typeof token).toBe('string');
      expect(token.length).toBeGreaterThan(0);
    });
    it('should return null for invalid credentials', () => {
      registerUser('user4', 'pass4');
      const token = authenticateUser('user4', 'wrongpass');
      expect(token).toBeNull();
    });
    it('should return null for non-existent user', () => {
      const token = authenticateUser('nouser', 'nopass');
      expect(token).toBeNull();
    });
  });

  describe('generateToken', () => {
    it('should generate a valid JWT token', () => {
      const token = generateToken('user5');
      expect(typeof token).toBe('string');
      expect(token.length).toBeGreaterThan(0);
      const payload = verifyToken(token);
      expect(payload).toHaveProperty('username', 'user5');
      expect(payload).toHaveProperty('chatToken');
    });
  });

  describe('verifyToken', () => {
    it('should verify a valid token and return payload', () => {
      const token = generateToken('user6');
      const payload = verifyToken(token);
      expect(payload).toHaveProperty('username', 'user6');
      expect(payload).toHaveProperty('chatToken');
    });
    it('should return null for invalid token', () => {
      const payload = verifyToken('invalidtoken');
      expect(payload).toBeNull();
    });
    it('should return null for expired token', () => {
      // Create a token with short expiry
      const jwt = require('jsonwebtoken');
      const SECRET = process.env.JWT_SECRET || 'supersecretkey';
      const token = jwt.sign({ username: 'user7' }, SECRET, { expiresIn: '1ms' });
      setTimeout(() => {
        const payload = verifyToken(token);
        expect(payload).toBeNull();
      }, 10);
    });
  });
});
