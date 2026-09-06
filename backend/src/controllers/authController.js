const User = require('../models/User');
const generateToken = require('../utils/generateToken');

// Shape the user object returned to clients (never expose the password hash).
const sanitize = (user) => ({
  id: user._id,
  name: user.name,
  email: user.email,
  role: user.role,
});

// Reject credential values that are not plain strings. Objects such as
// { "$gt": "" } would otherwise reach Mongoose as query operators
// (NoSQL injection / auth bypass).
const areStrings = (...values) => values.every((v) => typeof v === 'string');

// POST /api/auth/register
const register = async (req, res) => {
  const { name, email, password } = req.body;

  if (!areStrings(name, email, password) || !name || !email || !password) {
    return res
      .status(400)
      .json({ message: 'Name, email and password are required' });
  }

  const existing = await User.findOne({ email });
  if (existing) {
    return res.status(409).json({ message: 'Email already registered' });
  }

  // Force the default role on public self-registration. Role is never taken
  // from the request body to prevent privilege escalation; elevating a user
  // to faculty/admin must go through a separate admin-authenticated path.
  const user = await User.create({ name, email, password, role: 'student' });
  const token = generateToken(user);

  return res.status(201).json({ token, user: sanitize(user) });
};

// POST /api/auth/login
const login = async (req, res) => {
  const { email, password } = req.body;

  if (!areStrings(email, password) || !email || !password) {
    return res.status(400).json({ message: 'Email and password are required' });
  }

  // Password is select:false, so request it explicitly for comparison.
  const user = await User.findOne({ email }).select('+password');
  if (!user || !(await user.comparePassword(password))) {
    return res.status(401).json({ message: 'Invalid credentials' });
  }

  const token = generateToken(user);
  return res.status(200).json({ token, user: sanitize(user) });
};

// GET /api/auth/me (protected)
const getMe = async (req, res) => {
  const user = await User.findById(req.user.id);
  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }
  return res.status(200).json({ user: sanitize(user) });
};

module.exports = { register, login, getMe };
