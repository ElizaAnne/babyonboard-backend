// src/routes/payment.js
import express from 'express';
const router = express.Router();

// GET route example
router.get('/', (req, res) => {
  res.json({ message: 'Payment route working' });
});

// POST route example
router.post('/', async (req, res) => {
  try {
    // Payment processing logic will go here
    res.json({ message: 'Payment endpoint ready' });
  } catch (error) {
    console.error('Payment error:', error);
    res.status(500).json({ error: 'Payment processing failed' });
  }
});

export default router;
