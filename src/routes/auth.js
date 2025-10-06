// src/routes/authRoutes.js
const express = require('express');
const router = express.Router();
const { register } = require('../controllers/authController');
const validateRegistration = require('../middleware/validateRegistration');

router.post('/register', validateRegistration, register);

module.exports = router;
