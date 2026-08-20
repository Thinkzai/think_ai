const request = require('supertest');
const express = require('express');
const paymentRouter = require('../routes/paymentRoutes');

const app = express();
app.use(express.json());
app.use('/api/payments', paymentRouter);

// Mock the Prisma client layer inside the controllers
jest.mock('@prisma/client', () => {
    const mPrismaClient = {
        transaction: {
            create: jest.fn().mockResolvedValue({ id: 'pi_mocked_id' }),
        },
    };
    return { PrismaClient: jest.fn(() => mPrismaClient) };
});

describe('=== Pod B Payments Validation Suite ===', () => {
    it('✓ Should reject request missing required body values', async () => {
        const res = await request(app)
            .post('/api/payments/create-intent')
            .send({ gateway: 'stripe', amount: -20 });
        expect(res.statusCode).toBe(400);
    });

    it('✓ Should pass validation when correct values are sent', async () => {
        const res = await request(app)
            .post('/api/payments/create-intent')
            .send({ 
                gateway: 'stripe', 
                amount: 1000, 
                currency: 'usd', 
                email: 'test@thinkz.ai', 
                phone: '1234567890' 
            });
        
        // Verifies the status code is 201 Created
        expect(res.statusCode).toBe(201);
        
        // FIXED: Uses standard Jest regex matcher syntax correctly
        expect(res.body.id).toEqual(expect.stringMatching(/^pi_/)); 
    });
});