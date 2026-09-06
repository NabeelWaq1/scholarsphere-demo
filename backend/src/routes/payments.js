const express = require('express');
const prisma = require('../db');
const { authenticate } = require('../middleware/auth');

const router = express.Router();

// POST /api/payments/fake-checkout
router.post('/fake-checkout', authenticate, async (req, res) => {
  try {
    const { related_type, related_id, amount, card_number, card_expiry, card_cvv } = req.body;

    if (!card_number || !card_expiry || !card_cvv) {
      return res.status(400).json({ error: 'All payment card fields are required.' });
    }

    const cleanCard = card_number.replace(/\s+/g, '');
    const card_last4 = cleanCard.length >= 4 ? cleanCard.slice(-4) : '4242';
    const numAmount = parseFloat(amount) || 0.0;

    // Simulate brief processing delay
    await new Promise((resolve) => setTimeout(resolve, 600));

    const payment = await prisma.payment.create({
      data: {
        user_id: req.user.id,
        related_type: related_type || 'service_booking',
        related_id: related_id ? parseInt(related_id) : 0,
        amount: numAmount,
        card_last4,
        status: 'success'
      }
    });

    res.json({
      payment_id: payment.id,
      status: 'success',
      card_last4,
      amount: numAmount,
      created_at: payment.created_at
    });
  } catch (error) {
    console.error('Fake checkout error:', error);
    res.status(500).json({ error: 'Payment processing error.' });
  }
});

module.exports = router;
