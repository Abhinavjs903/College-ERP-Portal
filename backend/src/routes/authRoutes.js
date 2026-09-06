const express = require('express');
const { register, login, getMe } = require('../controllers/authController');
const asyncHandler = require('../utils/asyncHandler');
const protect = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/register', asyncHandler(register));
router.post('/login', asyncHandler(login));
router.get('/me', protect, asyncHandler(getMe));

module.exports = router;
