import type { NextApiRequest, NextApiResponse } from 'next';
import { get, run } from '@/lib/db';
import directoryCarpenters from '@/data/carpenters_directory.json';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { identifier } = req.body;
    if (!identifier) {
      return res.status(400).json({ error: 'Mobile number or Membership ID is required.' });
    }

    const clean = identifier.trim();
    const cleanMobile = clean.replace(/\D/g, '');

    // 1. Check in SQLite members table
    let member = await get(
      'SELECT * FROM members WHERE membership_id = ? OR mobile = ? OR email = ?',
      [clean.toUpperCase(), cleanMobile, clean.toLowerCase()]
    );

    // 2. If not found in members table, search the 4,614 state carpenters directory
    if (!member) {
      const match = (directoryCarpenters as any[]).find((c: any) => {
        const cMobile = (c.mobile || '').replace(/\D/g, '');
        const cId = (c.id || '').trim();
        return (
          (cleanMobile && cMobile === cleanMobile) ||
          clean.toUpperCase() === cId.toUpperCase() ||
          clean.toUpperCase() === `APSCA-DIR-${cId}`
        );
      });

      if (match) {
        const memberId = `APSCA-DIR-${match.id}`;
        const defaultMobile = match.mobile || cleanMobile || '0000000000';
        const defaultEmail = `${defaultMobile}@apsca.org`;

        await run(
          `INSERT OR IGNORE INTO members (
            membership_id, full_name, mobile, email,
            address, city, district, state,
            organization, membership_plan, amount,
            payment_status, payment_method, status
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          [
            memberId,
            match.name,
            defaultMobile,
            defaultEmail,
            'Andhra Pradesh State Carpenters Association Verified Craftsman Roll',
            'Andhra Pradesh',
            'Andhra Pradesh',
            'Andhra Pradesh',
            'APSCA Official State Roll',
            'General membership',
            0,
            'paid',
            'Official Directory Roll',
            'active',
          ]
        );

        member = await get('SELECT * FROM members WHERE membership_id = ?', [memberId]);
      }
    }

    if (!member) {
      return res.status(404).json({
        error: `No registered member found matching "${identifier}". You can test with Mobile: 9848022338 or 9399980781, or register as a new member.`,
      });
    }

    return res.status(200).json({
      success: true,
      member,
    });
  } catch (err: any) {
    console.error('Member login error:', err);
    return res.status(500).json({ error: 'Server error: ' + err.message });
  }
}
