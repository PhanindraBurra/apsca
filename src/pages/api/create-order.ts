import type { NextApiRequest, NextApiResponse } from 'next';
import Razorpay from 'razorpay';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { amount, membership_id, plan_name } = req.body;
    const numAmount = Number(amount);

    if (!numAmount || numAmount <= 0) {
      return res.status(400).json({ error: 'Valid payment amount is required' });
    }

    const key_id = process.env.RAZORPAY_KEY_ID || 'rzp_test_51APSCA2026Test';
    const key_secret = process.env.RAZORPAY_KEY_SECRET || 'APSCASecretKey2026TestMode';

    let orderId = `order_${membership_id}_${Date.now()}`;
    let isMock = true;

    // Attempt real Razorpay order if live keys provided
    if (key_id && !key_id.includes('Test') && key_secret && !key_secret.includes('TestMode')) {
      try {
        const instance = new Razorpay({ key_id, key_secret });
        const options = {
          amount: Math.round(numAmount * 100), // amount in paise
          currency: 'INR',
          receipt: `rcpt_${membership_id}`,
          notes: {
            membership_id,
            plan_name: plan_name || 'APSCA Membership',
          },
        };
        const order = await instance.orders.create(options);
        orderId = order.id;
        isMock = false;
      } catch (rzpErr) {
        console.warn('Razorpay SDK notice (using test mode fallback):', rzpErr);
      }
    }

    return res.status(200).json({
      order_id: orderId,
      amount: numAmount,
      amount_paise: Math.round(numAmount * 100),
      currency: 'INR',
      key_id,
      membership_id,
      is_test_mode: isMock,
    });
  } catch (err: any) {
    console.error('Order creation error:', err);
    return res.status(500).json({ error: 'Failed to create payment order. ' + err.message });
  }
}
