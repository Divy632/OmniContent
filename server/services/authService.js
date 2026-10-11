const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { userStore } = require('./dataStore');
const { JWT_SECRET } = require('../middleware/auth');

function generateToken(user) {
  return jwt.sign(
    {
      id: user._id,
      email: user.email,
      name: user.name
    },
    JWT_SECRET,
    { expiresIn: '7d' }
  );
}

async function register({ name, email, password }) {
  if (!name || !email || !password) {
    const err = new Error('Please provide name, email, and password.');
    err.statusCode = 400;
    err.code = 'MISSING_FIELDS';
    throw err;
  }

  if (password.length < 6) {
    const err = new Error('Password must be at least 6 characters long.');
    err.statusCode = 400;
    err.code = 'WEAK_PASSWORD';
    throw err;
  }

  const existing = await userStore.findByEmail(email);
  if (existing) {
    const err = new Error('An account with this email address already exists.');
    err.statusCode = 409;
    err.code = 'EMAIL_EXISTS';
    throw err;
  }

  const salt = await bcrypt.genSalt(10);
  const passwordHash = await bcrypt.hash(password, salt);

  const newUser = await userStore.create({
    name,
    email,
    passwordHash,
    preferences: {
      language: 'English',
      tone: 'Professional',
      visualStyle: 'Modern Minimalist'
    }
  });

  const token = generateToken(newUser);
  const { passwordHash: _, ...userSafe } = newUser.toObject ? newUser.toObject() : newUser;

  return { user: userSafe, token };
}

async function login({ email, password }) {
  if (!email || !password) {
    const err = new Error('Please provide both email and password.');
    err.statusCode = 400;
    err.code = 'MISSING_FIELDS';
    throw err;
  }

  const user = await userStore.findByEmail(email);
  if (!user) {
    const err = new Error('Invalid email or password.');
    err.statusCode = 401;
    err.code = 'INVALID_CREDENTIALS';
    throw err;
  }

  const isMatch = await bcrypt.compare(password, user.passwordHash);
  if (!isMatch) {
    const err = new Error('Invalid email or password.');
    err.statusCode = 401;
    err.code = 'INVALID_CREDENTIALS';
    throw err;
  }

  const token = generateToken(user);
  const { passwordHash: _, ...userSafe } = user.toObject ? user.toObject() : user;

  return { user: userSafe, token };
}

module.exports = {
  register,
  login
};
