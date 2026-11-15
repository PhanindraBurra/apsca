import type { NextApiRequest, NextApiResponse } from 'next';
import { query } from '@/lib/db';

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'admin123';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const auth = (req.query.password as string) || (req.headers['x-admin-password'] as string);

  if (auth !== ADMIN_PASSWORD) {
    return res.status(401).send('Unauthorized');
  }

  try {
    const members = await query('SELECT * FROM members ORDER BY id DESC');

    const headers = [
      'Membership ID',
      'Full Name',
      'Date of Birth',
      'Gender',
      'Mobile',
      'Email',
      'District',
      'City',
      'PIN Code',
      'Organization / Club',
      'Local Union Address',
      'Nominee Name',
      'Plan Name',
      'Amount (INR)',
      'Payment Status',
      'Payment Method',
      'Transaction ID',
      'Registered Date',
    ];

    const escapeCsv = (val: any) => {
      if (val === null || val === undefined) return '""';
      const str = String(val).replace(/"/g, '""');
      return `"${str}"`;
    };

    const csvRows = [headers.join(',')];

    for (const m of members) {
      csvRows.push(
        [
          escapeCsv(m.membership_id),
          escapeCsv(m.full_name),
          escapeCsv(m.dob),
          escapeCsv(m.gender),
          escapeCsv(m.mobile),
          escapeCsv(m.email),
          escapeCsv(m.district),
          escapeCsv(m.city),
          escapeCsv(m.pincode),
          escapeCsv(m.organization),
          escapeCsv(m.local_union_address),
          escapeCsv(m.nominee_name),
          escapeCsv(m.membership_plan),
          escapeCsv(m.amount),
          escapeCsv(m.payment_status),
          escapeCsv(m.payment_method),
          escapeCsv(m.payment_id),
          escapeCsv(m.created_at),
        ].join(',')
      );
    }

    const csvContent = csvRows.join('\r\n');

    res.setHeader('Content-Type', 'text/csv; charset=utf-8');
    res.setHeader('Content-Disposition', `attachment; filename="APSCA_Members_Export_${Date.now()}.csv"`);
    return res.status(200).send(csvContent);
  } catch (err: any) {
    console.error('Export error:', err);
    return res.status(500).send('Error generating export: ' + err.message);
  }
}
