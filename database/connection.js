import mysql from 'mysql2/promise';

const connection = await mysql.createConnection({
  host: 'localhost',
  user: 'root',
  database: 'webhook_db',
  password: '123123',
  multipleStatements: true
})

export default connection;
