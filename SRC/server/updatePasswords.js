const mysql = require('mysql2/promise');
const bcrypt = require('bcrypt');
require('dotenv').config();

async function updatePasswords() {
  const db = await mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
  });

  const admins = [
    { username: 'admin', password: 'admin' }
  ];

  for (const admin of admins) {
    const hashedPassword = await bcrypt.hash(admin.password, 10);
    const query = 'UPDATE admin SET password = ? WHERE username = ?';
    await db.query(query, [hashedPassword, admin.username]);
  }

  await db.end();
  console.log('Passwords updated successfully');
}

updatePasswords().catch(err => console.error(err));