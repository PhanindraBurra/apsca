const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.join(__dirname, '..', 'data', 'apsca.db');
const db = new sqlite3.Database(dbPath);

const demoMembers = [
  {
    membership_id: 'APSCA-2026-0002',
    full_name: 'K. Venkateswara Rao',
    dob: '1978-05-15',
    gender: 'Male',
    mobile: '9399980781',
    email: 'venkateswara.rao@apsca.co.in',
    address: 'Door No. 12-4-56, Wood Craft Center, Governorpet',
    city: 'Vijayawada',
    district: 'Krishna',
    state: 'Andhra Pradesh',
    pincode: '520002',
    organization: 'Krishna District Carpenters Union',
    local_union_address: 'APSCA Bhavan, Vijayawada',
    nominee_name: 'K. Lakshmi',
    membership_plan: 'State Executive Membership',
    amount: 900,
    payment_status: 'paid',
    payment_method: 'UPI / Direct Transfer',
    payment_id: 'pay_AP_PRESIDENT_002',
    status: 'active'
  },
  {
    membership_id: 'APSCA-2026-0003',
    full_name: 'S. Veera Brahmam',
    dob: '1982-08-20',
    gender: 'Male',
    mobile: '9491552702',
    email: 'veera.brahmam@example.com',
    address: 'H.No. 45/2, Artisan Colony, Gajuwaka',
    city: 'Visakhapatnam',
    district: 'Visakhapatnam',
    state: 'Andhra Pradesh',
    pincode: '530026',
    organization: 'Visakha Wood Carvers Guild',
    local_union_address: 'Visakhapatnam District Federation',
    nominee_name: 'S. Parvathi',
    membership_plan: 'State Committee membership',
    amount: 300,
    payment_status: 'paid',
    payment_method: 'Razorpay UPI',
    payment_id: 'pay_DEMO_VERIFIED_003',
    status: 'active'
  }
];

const insertSql = `
  INSERT OR REPLACE INTO members (
    membership_id, full_name, dob, gender, mobile, email,
    address, city, district, state, pincode,
    organization, local_union_address, nominee_name,
    membership_plan, amount, payment_status, payment_method,
    payment_id, status
  ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
`;

db.serialize(() => {
  demoMembers.forEach((m) => {
    db.run(
      insertSql,
      [
        m.membership_id,
        m.full_name,
        m.dob,
        m.gender,
        m.mobile,
        m.email,
        m.address,
        m.city,
        m.district,
        m.state,
        m.pincode,
        m.organization,
        m.local_union_address,
        m.nominee_name,
        m.membership_plan,
        m.amount,
        m.payment_status,
        m.payment_method,
        m.payment_id,
        m.status
      ],
      function (err) {
        if (err) {
          console.error('Error inserting member:', err);
        } else {
          console.log(`Successfully seeded ${m.membership_id} - ${m.full_name}`);
        }
      }
    );
  });
});

db.close();
