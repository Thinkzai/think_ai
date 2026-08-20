const express = require('express');
const { createPaymentIntent, handleWebhook } = require('../controllers/paymentController');
const router = express.Router();

router.post('/create-intent', createPaymentIntent);
router.post('/webhook/:gateway', handleWebhook);

module.exports = router;