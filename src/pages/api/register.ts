import type { NextApiRequest, NextApiResponse } from 'next';
import { get, run, query } from '@/lib/db';

export const config = {
  api: {
    bodyParser: {
      sizeLimit: '25mb', // allow photo & ID upload data URLs
    },
  },
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const {
      full_name,
      dob,
      gender,
      mobile,
      email,
      address,
      city,
      district,
      state = 'Andhra Pradesh',
      pincode,
      organization,
      local_union_address,
      nominee_name,
      membership_plan,
      amount = 0,
      photo_url = '',
      id_proof_url = '',
    } = req.body;

    // 1. Validation
    if (!full_name || !mobile || !email || !membership_plan) {
      return res.status(400).json({ error: 'Full name, mobile number, email, and membership plan are required.' });
    }

    let cleanMobile = mobile.toString().replace(/\D/g, '');
    if (cleanMobile.length === 12 && cleanMobile.startsWith('91')) {
      cleanMobile = cleanMobile.slice(2);
    } else if (cleanMobile.length === 11 && cleanMobile.startsWith('0')) {
      cleanMobile = cleanMobile.slice(1);
    }

    if (cleanMobile.length !== 10) {
      return res.status(400).json({ error: 'Please enter a valid 10-digit mobile number.' });
    }

    const cleanEmail = email.toLowerCase().trim();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(cleanEmail)) {
      return res.status(400).json({ error: 'Please enter a valid email address.' });
    }

    const numAmount = Number(amount) || 0;
    const payment_status = numAmount === 0 ? 'free' : 'pending';
    const payment_method = numAmount === 0 ? 'free' : 'pending';

    // 2. Check for Existing Registration
    const existing = await get(
      'SELECT id, membership_id, full_name, mobile, email, payment_status, amount, membership_plan FROM members WHERE mobile = ? OR email = ?',
      [cleanMobile, cleanEmail]
    );

    if (existing) {
      // Determine payment status:
      // If free plan -> free
      // If paid plan and already paid for this exact plan -> keep paid
      // Otherwise -> pending payment
      let updatedPaymentStatus = numAmount === 0 ? 'free' : 'pending';
      if (numAmount > 0 && existing.membership_plan === membership_plan && existing.payment_status === 'paid') {
        updatedPaymentStatus = 'paid';
      }

      // Always update member record with the newly submitted details
      await run(
        `UPDATE members SET
          full_name = ?,
          dob = ?,
          gender = ?,
          mobile = ?,
          email = ?,
          address = ?,
          city = ?,
          district = ?,
          state = ?,
          pincode = ?,
          organization = ?,
          local_union_address = ?,
          nominee_name = ?,
          membership_plan = ?,
          amount = ?,
          payment_status = ?,
          status = 'active',
          photo_url = CASE WHEN ? != '' THEN ? ELSE photo_url END,
          id_proof_url = CASE WHEN ? != '' THEN ? ELSE id_proof_url END
        WHERE id = ?`,
        [
          full_name.trim(),
          dob || '',
          gender || 'Male',
          cleanMobile,
          cleanEmail,
          address || '',
          city || '',
          district || '',
          state,
          pincode || '',
          organization || '',
          local_union_address || '',
          nominee_name || '',
          membership_plan,
          numAmount,
          updatedPaymentStatus,
          photo_url || '',
          photo_url || '',
          id_proof_url || '',
          id_proof_url || '',
          existing.id,
        ]
      );

      return res.status(200).json({
        success: true,
        updated: true,
        id: existing.id,
        membership_id: existing.membership_id,
        full_name: full_name.trim(),
        mobile: cleanMobile,
        email: cleanEmail,
        district: district || '',
        membership_plan,
        amount: numAmount,
        payment_status: updatedPaymentStatus,
        is_paid: updatedPaymentStatus === 'paid' || updatedPaymentStatus === 'free',
      });
    }

    // 3. Generate Unique Membership ID for New Member
    const countRow = await get<{ count: number }>('SELECT COUNT(*) as count FROM members');
    const serial = (countRow?.count || 0) + 1;
    const membership_id = `APSCA-2026-${String(serial).padStart(4, '0')}`;

    // 4. Insert into SQLite
    const result = await run(
      `INSERT INTO members (
        membership_id, full_name, dob, gender, mobile, email,
        address, city, district, state, pincode, organization,
        local_union_address, nominee_name, membership_plan,
        amount, payment_status, payment_method, photo_url, id_proof_url
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        membership_id,
        full_name.trim(),
        dob || '',
        gender || 'Male',
        cleanMobile,
        cleanEmail,
        address || '',
        city || '',
        district || '',
        state,
        pincode || '',
        organization || '',
        local_union_address || '',
        nominee_name || '',
        membership_plan,
        numAmount,
        payment_status,
        payment_method,
        photo_url || '',
        id_proof_url || '',
      ]
    );

    return res.status(201).json({
      success: true,
      id: result.lastID,
      membership_id,
      full_name: full_name.trim(),
      mobile: cleanMobile,
      email: cleanEmail,
      membership_plan,
      amount: numAmount,
      payment_status,
    });
  } catch (error: any) {
    console.error('Registration API error:', error);
    return res.status(500).json({ error: 'Internal server error processing registration. ' + error.message });
  }
}
