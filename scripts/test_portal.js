const http = require('http');

const BASE_URL = 'http://localhost:3001';

async function fetchUrl(path, options = {}) {
  return new Promise((resolve, reject) => {
    const url = new URL(path, BASE_URL);
    const req = http.request(
      url,
      {
        method: options.method || 'GET',
        headers: options.headers || {},
      },
      (res) => {
        let body = '';
        res.on('data', (chunk) => (body += chunk));
        res.on('end', () => resolve({ status: res.statusCode, headers: res.headers, body }));
      }
    );
    req.on('error', reject);
    if (options.body) req.write(options.body);
    req.end();
  });
}

async function runTests() {
  console.log('====================================================');
  console.log('    TESTING REBUILT APSCA PORTAL (HTTP & API)      ');
  console.log('====================================================\n');

  // Test 1: Homepage
  console.log('1. Testing Homepage (GET /)...');
  const home = await fetchUrl('/');
  console.log(`   Status: ${home.status}`);
  console.log(`   Has Title: ${home.body.includes('APSCA')}`);
  console.log(`   Has Telugu Heading: ${home.body.includes('గౌరవప్రథమైన') || home.body.includes('Om Namo Viswakarma')}`);
  console.log(`   Has Logo: ${home.body.includes('logo.png')}`);

  // Test 2: About Us
  console.log('\n2. Testing About Us (GET /about-us)...');
  const about = await fetchUrl('/about-us');
  console.log(`   Status: ${about.status}`);
  console.log(`   Has Viswakarma Tribute: ${about.body.includes('శ్రీ విశ్వకర్మ పరబ్రహ్మణేనమ:')}`);
  console.log(`   Has Stone Age Essay: ${about.body.includes('ఉపోద్గాతం')}`);

  // Test 3: Members Page
  console.log('\n3. Testing Members & Leadership (GET /members)...');
  const members = await fetchUrl('/members');
  console.log(`   Status: ${members.status}`);
  console.log(`   Has State President: ${members.body.includes('TATIKONDA RANGA BABU')}`);
  console.log(`   Has General Secretary: ${members.body.includes('PEDAPUDI NARASIMHA MURTHY')}`);

  // Test 4: Carpenters Directory
  console.log('\n4. Testing Carpenters Directory (GET /carpenters)...');
  const carpenters = await fetchUrl('/carpenters');
  console.log(`   Status: ${carpenters.status}`);
  console.log(`   Has Directory Title: ${carpenters.body.includes('Carpenters Directory')}`);

  // Test 5: District Page (Anakapalli)
  console.log('\n5. Testing District Portal (GET /districts/anakapalli)...');
  const dist = await fetchUrl('/districts/anakapalli');
  console.log(`   Status: ${dist.status}`);
  console.log(`   Has District Name: ${dist.body.includes('Anakapalli')}`);
  console.log(`   Has District Committee Members: ${dist.body.includes('Patnala Prasad') || dist.body.includes('Rajesh Chukka')}`);

  // Test 6: Services Page
  console.log('\n6. Testing Services (GET /services/furniture-making)...');
  const svc = await fetchUrl('/services/furniture-making');
  console.log(`   Status: ${svc.status}`);
  console.log(`   Has Service Title: ${svc.body.includes('Furniture Making')}`);

  // Test 7: Events Page
  console.log('\n7. Testing Events (GET /events/indias-biggest-skill-competition)...');
  const ev = await fetchUrl('/events/indias-biggest-skill-competition');
  console.log(`   Status: ${ev.status}`);
  console.log(`   Has Event Title: ${ev.body.includes("India's Biggest Skill Competition")}`);

  // Test 8: Member Registration API
  console.log('\n8. Testing Member Registration (POST /api/register)...');
  const regPayload = JSON.stringify({
    full_name: 'Ramesh Chari',
    dob: '1990-05-15',
    gender: 'Male',
    mobile: '9848022338',
    email: 'ramesh.chari@example.com',
    address: 'D.No 5-12, Main Road',
    city: 'Vijayawada',
    district: 'Krishna',
    state: 'Andhra Pradesh',
    pincode: '520001',
    organization: 'Furniture Making & Carpentry',
    local_union_address: 'Krishna District Carpenters Welfare Association',
    nominee_name: 'Lakshmi Chari',
    membership_plan: 'State Committee membership',
    amount: 300,
  });

  const regRes = await fetchUrl('/api/register', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: regPayload,
  });
  console.log(`   Status: ${regRes.status}`);
  const regData = JSON.parse(regRes.body);
  console.log(`   Registration Result:`, regData);
  const membershipId = regData.membership_id;

  // Test 9: Duplicate Protection
  console.log('\n9. Testing Duplicate Protection (Duplicate Mobile/Email)...');
  const dupRes = await fetchUrl('/api/register', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: regPayload,
  });
  console.log(`   Status: ${dupRes.status} (Expected 400)`);
  console.log(`   Error Response: ${dupRes.body}`);

  // Test 10: Create Razorpay Order
  console.log('\n10. Testing Payment Order Creation (POST /api/create-order)...');
  const orderRes = await fetchUrl('/api/create-order', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      amount: 300,
      membership_id: membershipId,
      plan_name: 'State Committee membership',
    }),
  });
  console.log(`   Status: ${orderRes.status}`);
  console.log(`   Order Response: ${orderRes.body}`);

  // Test 11: Payment Verification
  console.log('\n11. Testing Payment Verification (POST /api/verify-payment)...');
  const verifyRes = await fetchUrl('/api/verify-payment', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      membership_id: membershipId,
      payment_id: 'pay_test_' + Date.now(),
      payment_method: 'razorpay',
    }),
  });
  console.log(`   Status: ${verifyRes.status}`);
  console.log(`   Verify Response: ${verifyRes.body}`);

  // Test 12: Member Login / Lookup
  console.log('\n12. Testing Member Profile Lookup (POST /api/member-login)...');
  const loginRes = await fetchUrl('/api/member-login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ identifier: '9848022338' }),
  });
  console.log(`   Status: ${loginRes.status}`);
  const loginData = JSON.parse(loginRes.body);
  console.log(`   Login Result: Name: ${loginData.member?.full_name}, Status: ${loginData.member?.payment_status}, ID: ${loginData.member?.membership_id}`);

  // Test 13: Admin Members Query
  console.log('\n13. Testing Admin Portal (GET /api/admin/members)...');
  const adminRes = await fetchUrl('/api/admin/members', {
    headers: { 'x-admin-password': 'admin123' },
  });
  console.log(`   Status: ${adminRes.status}`);
  const adminData = JSON.parse(adminRes.body);
  console.log(`   Total Members in DB: ${adminData.stats?.total}, Paid: ${adminData.stats?.paid}`);

  // Test 14: Admin CSV Export
  console.log('\n14. Testing Admin CSV Export (GET /api/admin/export)...');
  const exportRes = await fetchUrl('/api/admin/export?password=admin123');
  console.log(`   Status: ${exportRes.status}`);
  console.log(`   Content-Type: ${exportRes.headers['content-type']}`);
  console.log(`   First Line of CSV: ${exportRes.body.split('\r\n')[0]}`);
  console.log(`   Member Row in CSV: ${exportRes.body.split('\r\n')[1]}`);

  console.log('\n====================================================');
  console.log('           ALL 14 TESTS COMPLETED!                  ');
  console.log('====================================================');
}

runTests().catch(console.error);
