const connection = require('../db/db-connection');
const crypto = require('crypto');

const hashPassword = (password) => {
    return crypto.createHash('sha256').update(password).digest('hex');
};




const userRegister = (req, res) => {
    // Hash the password
    const hashedPassword = hashPassword(req.body.password);

    connection.query(
        'INSERT INTO users (name, email, password) VALUES (?, ?, ?)',
        [req.body.name, req.body.email, hashedPassword],
        (err) => {
            if (err) {
                console.error('Error inserting user:', err);
                res.status(500).send('Error registering user');
            } else {
                res.send('User registered!');
                
            }
        }
    );
};



const userLogin = (req, res) => {
    const { email, password } = req.body;
    const hashedPassword = hashPassword(password); // Hash the input password for comparison

    connection.query(
        'SELECT * FROM users WHERE email = ?',
        [email],
        (err, results) => {
            if (err) {
                console.error('Error finding user:', err);
                res.status(500).send('Error logging in');
            } else if (results.length === 0) {
                res.status(404).send('User not found');
            } else {
                const user = results[0];
                if (user.password === hashedPassword) {
                    res.send('Login successful!');
                } else {
                    res.status(401).send('Incorrect password');
                }
            }
        }
    );
};

const userGet = (req, res) => {
    connection.query(
        'SELECT id, name, email FROM users',
        (err, results) => {
            if (err) {
                console.error('Error retrieving users:', err);
                res.status(500).send('Error retrieving users');
            } else {
                res.json(results);
            }
        }
    );
};

module.exports = { userRegister, userLogin, userGet };
