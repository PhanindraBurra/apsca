const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.join(__dirname, '..', 'data', 'apsca.db');
const db = new sqlite3.Database(dbPath);

db.serialize(() => {
  db.run(`UPDATE members SET membership_plan = 'State Executive Membership', amount = 900 WHERE membership_plan LIKE '%Patron%' OR amount = 5000`);
  db.run(`UPDATE members SET membership_plan = 'State Committee membership', amount = 300 WHERE membership_plan LIKE '%1,000%' OR amount = 1000`);
  db.run(`UPDATE members SET membership_plan = 'General membership', amount = 0 WHERE membership_plan LIKE '%Verified Carpenter%'`);

  db.all('SELECT id, membership_id, full_name, mobile, membership_plan, amount, payment_status FROM members', (err, rows) => {
    if (err) {
      console.error(err);
    } else {
      console.log('Updated Members:');
      console.log(JSON.stringify(rows, null, 2));
    }
    db.close();
  });
});
