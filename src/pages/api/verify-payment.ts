import type { NextApiRequest, NextApiResponse } from 'next';
import { get, run } from '@/lib/db';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { membership_id, payment_id, payment_method = 'razorpay', utr_number = '' } = req.body;

    if (!membership_id) {
      return res.status(400).json({ error: 'Membership ID is required.' });
    }

    const member = await get('SELECT * FROM members WHERE membership_id = ?', [membership_id]);
    if (!member) {
      return res.status(404).json({ error: 'Member not found with ID: ' + membership_id });
    }

    const finalPaymentId = payment_id || utr_number || `TXN_${Date.now()}`;
    const paymentStatus = payment_method === 'upi_bank' ? 'pending_verification' : 'paid';

    await run(
      `UPDATE members SET
        payment_status = ?,
        payment_method = ?,
        payment_id = ?,
        status = 'active'
      WHERE membership_id = ?`,
      [paymentStatus, payment_method, finalPaymentId, membership_id]
    );

    const updated = await get('SELECT * FROM members WHERE membership_id = ?', [membership_id]);

    return res.status(200).json({
      success: true,
      message: 'Payment verified and membership activated.',
      member: updated,
    });
  } catch (err: any) {
    console.error('Verify payment error:', err);
    return res.status(500).json({ error: 'Failed to verify payment: ' + err.message });
  }
}
