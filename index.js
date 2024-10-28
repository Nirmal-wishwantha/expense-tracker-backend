const express = require('express');
const mysql = require('mysql2');
var bodyParser = require('body-parser')


const app = express();
const port = 3000;

app.use(express.json());

const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'acpt'
});


// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded())

// parse application/json
app.use(bodyParser.json())


db.connect(err => {
  if (err) {
    console.error('Error connecting to MySQL:', err);
    return;
  }
  console.log('Connected to MySQL database');

  // Create the database if it doesn't exist
  db.query("CREATE DATABASE IF NOT EXISTS expensive_tractor", (err) => {
    if (err) {
      console.error('Error creating database:', err);
      return;
    }
    console.log('Database created or already exists');

    // Use the database for further operations
    db.changeUser({ database: 'expensive_tractor' }, (err) => {
      if (err) {
        console.error('Error switching to database:', err);
        return;
      }
      console.log('Switched to database expensive_tractor');

      // Create tables if they don't exist
      const createUserTable = `
        CREATE TABLE IF NOT EXISTS users (
          id INT AUTO_INCREMENT PRIMARY KEY,
          name VARCHAR(255),
          email VARCHAR(255) UNIQUE,
          password VARCHAR(255)
        )
      `;

      const createExpenseTable = `
        CREATE TABLE IF NOT EXISTS expenses (
          id INT AUTO_INCREMENT PRIMARY KEY,
          user_id INT,
          education DECIMAL(10, 2),
          food DECIMAL(10, 2),
          antitreatment DECIMAL(10, 2),
          transport DECIMAL(10, 2),
          shopping DECIMAL(10, 2),
          other DECIMAL(10, 2),
          date DATE,
          amount DECIMAL(10, 2),
          FOREIGN KEY (user_id) REFERENCES users(id)
        )
      `;

      db.query(createUserTable, err => {
        if (err) {
          console.error('Error creating users table:', err);
        } else {
          console.log('Users table created or already exists');
        }
      });

      db.query(createExpenseTable, err => {
        if (err) {
          console.error('Error creating expenses table:', err);
        } else {
          console.log('Expenses table created or already exists');
        }
      });
    });
  });
});



app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
