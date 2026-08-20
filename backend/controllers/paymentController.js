const crypto = require('crypto');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

const createPaymentIntent = async (req, res) => {
    try {
        const { gateway, amount, currency, email, phone } = req.body;

        if (!gateway || !amount || !currency || !email || !phone) {
            return res.status(400).json({ error: "Missing required fields" });
        }

        if (amount <= 0) {
            return res.status(400).json({ error: "Amount must be positive" });
        }

        // FIXED: Enclosed completely in backticks (``)
        const mockId = `pi_${Math.random().toString(36).substring(2, 11)}`;

        // Create transaction using your synced Prisma model
        await prisma.transaction.create({
            data: { id: mockId, amount, currency, email, phone, status: 'pending', gateway }
        });

        return res.status(201).json({ id: mockId, clientSecret: 'secret_123', gateway });
    } catch (error) {
        return res.status(400).json({ error: error.message });
    }
};

const handleWebhook = async (req, res) => {
    try {
        return res.status(200).json({ received: true });
    } catch (err) {
        return res.status(400).send(`Webhook Error: ${err.message}`);
    }
};

module.exports = { createPaymentIntent, handleWebhook };