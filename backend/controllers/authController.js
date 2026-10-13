const jwt = require('jsonwebtoken');
const User = require('../models/User');

const JWT_SECRET = process.env.JWT_SECRET || 'monefy_secret_key';

const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password)
      return res.status(400).json({ error: 'Name, email and password are required' });
    if (password.length < 6)
      return res.status(400).json({ error: 'Password must be at least 6 characters' });
    const existing = await User.findOne({ email });
    if (existing)
      return res.status(409).json({ error: 'Email already registered' });
    const user = await User.create({ name, email, password });
    const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: '90d' });
    res.status(201).json({ token, userId: user._id, name: user.name, email: user.email });
  } catch (err) {
    res.status(500).json({ error: 'Registration failed' });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password)
      return res.status(400).json({ error: 'Email and password are required' });
    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ error: 'Invalid email or password' });
    const ok = await user.comparePassword(password);
    if (!ok) return res.status(401).json({ error: 'Invalid email or password' });
    const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: '90d' });
    res.json({ token, userId: user._id, name: user.name, email: user.email });
  } catch (err) {
    res.status(500).json({ error: 'Login failed' });
  }
};

module.exports = { register, login };
