// db-setup.js
const connection = require('./db-connection');

const setupDatabase = () => {
  connection.connect(err => {
    if (err) {
      console.error('Error connecting to MySQL:', err);
      return;
    }
    console.log('Connected to MySQL database');

    
    connection.query("CREATE DATABASE IF NOT EXISTS expensive_tracker", (err) => {
      if (err) {
        console.error('Error creating database:', err);
        return;
      }
      console.log('Database created or already exists');

      connection.changeUser({ database: 'expensive_tracker' }, (err) => {
        if (err) {
          console.error('Error switching to database:', err);
          return;
        }
        console.log('Switched to database expensive_tractor');

        
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
            category ENUM('education', 'food', 'entertainment', 'transport', 'shopping', 'other') NOT NULL,
            amount DECIMAL(10, 2),
            date DATE,
            FOREIGN KEY (user_id) REFERENCES users(id)
          )
        `;

        connection.query(createUserTable, err => {
          if (err) {
            console.error('Error creating users table:', err);
          } else {
            console.log('Users table created or already exists');
          }
        });

        connection.query(createExpenseTable, err => {
          if (err) {
            console.error('Error creating expenses table:', err);
          } else {
            console.log('Expenses table created or already exists');
          }
        });
      });
    });
  });
};

module.exports = setupDatabase;
