import type { NextApiRequest, NextApiResponse } from 'next';
import { query, run, get } from '@/lib/db';

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'admin123';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const authHeader = req.headers['x-admin-password'] || req.query.password;

  if (authHeader !== ADMIN_PASSWORD) {
    return res.status(401).json({ error: 'Unauthorized. Invalid admin password.' });
  }

  // GET: Fetch members
  if (req.method === 'GET') {
    try {
      const search = (req.query.search as string) || '';
      const district = (req.query.district as string) || '';
      const plan = (req.query.plan as string) || '';
      const status = (req.query.status as string) || '';

      let sql = 'SELECT * FROM members WHERE 1=1';
      const params: any[] = [];

      if (search) {
        sql += ' AND (full_name LIKE ? OR membership_id LIKE ? OR mobile LIKE ? OR email LIKE ?)';
        const term = `%${search}%`;
        params.push(term, term, term, term);
      }

      if (district) {
        sql += ' AND district = ?';
        params.push(district);
      }

      if (plan) {
        sql += ' AND membership_plan = ?';
        params.push(plan);
      }

      if (status) {
        sql += ' AND payment_status = ?';
        params.push(status);
      }

      sql += ' ORDER BY id DESC';

      const members = await query(sql, params);
      const totalCount = await get<{ count: number }>('SELECT COUNT(*) as count FROM members');
      const paidCount = await get<{ count: number }>('SELECT COUNT(*) as count FROM members WHERE payment_status = "paid"');
      const pendingCount = await get<{ count: number }>('SELECT COUNT(*) as count FROM members WHERE payment_status = "pending" OR payment_status = "pending_verification"');

      return res.status(200).json({
        members,
        stats: {
          total: totalCount?.count || 0,
          paid: paidCount?.count || 0,
          pending: pendingCount?.count || 0,
        },
      });
    } catch (err: any) {
      console.error('Admin members fetch error:', err);
      return res.status(500).json({ error: 'Failed to fetch members: ' + err.message });
    }
  }

  // PUT: Update member details or status
  if (req.method === 'PUT') {
    try {
      const {
        id,
        full_name,
        mobile,
        email,
        dob,
        gender,
        address,
        city,
        district,
        state,
        pincode,
        organization,
        local_union_address,
        nominee_name,
        membership_plan,
        amount,
        payment_status,
        payment_method,
        payment_id,
        status,
      } = req.body;

      if (!id) return res.status(400).json({ error: 'Member id is required' });

      let cleanMobile = undefined;
      if (mobile) {
        cleanMobile = mobile.toString().replace(/\D/g, '').slice(-10);
      }

      await run(
        `UPDATE members SET
          full_name = COALESCE(?, full_name),
          mobile = COALESCE(?, mobile),
          email = COALESCE(?, email),
          dob = COALESCE(?, dob),
          gender = COALESCE(?, gender),
          address = COALESCE(?, address),
          city = COALESCE(?, city),
          district = COALESCE(?, district),
          state = COALESCE(?, state),
          pincode = COALESCE(?, pincode),
          organization = COALESCE(?, organization),
          local_union_address = COALESCE(?, local_union_address),
          nominee_name = COALESCE(?, nominee_name),
          membership_plan = COALESCE(?, membership_plan),
          amount = COALESCE(?, amount),
          payment_status = COALESCE(?, payment_status),
          payment_method = COALESCE(?, payment_method),
          payment_id = COALESCE(?, payment_id),
          status = COALESCE(?, status)
        WHERE id = ?`,
        [
          full_name ? full_name.trim() : null,
          cleanMobile || null,
          email ? email.trim().toLowerCase() : null,
          dob || null,
          gender || null,
          address ? address.trim() : null,
          city ? city.trim() : null,
          district ? district.trim() : null,
          state || null,
          pincode ? pincode.trim() : null,
          organization || null,
          local_union_address ? local_union_address.trim() : null,
          nominee_name ? nominee_name.trim() : null,
          membership_plan || null,
          amount !== undefined && amount !== null && amount !== '' ? Number(amount) : null,
          payment_status || null,
          payment_method || null,
          payment_id || null,
          status || null,
          id,
        ]
      );

      const updated = await get('SELECT * FROM members WHERE id = ?', [id]);

      return res.status(200).json({
        success: true,
        message: 'Member details successfully updated.',
        member: updated,
      });
    } catch (err: any) {
      console.error('Update member error:', err);
      return res.status(500).json({ error: 'Failed to update member: ' + err.message });
    }
  }

  // DELETE: Remove member
  if (req.method === 'DELETE') {
    try {
      const { id } = req.body;
      if (!id) return res.status(400).json({ error: 'Member id is required' });

      await run('DELETE FROM members WHERE id = ?', [id]);
      return res.status(200).json({ success: true, message: 'Member record removed.' });
    } catch (err: any) {
      return res.status(500).json({ error: 'Failed to delete member: ' + err.message });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
