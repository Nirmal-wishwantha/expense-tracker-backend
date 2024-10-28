const connection = require('../dbConnection/db-connection');

const userRegister = (req, res) => {
    // Use an array for values
    connection.query(
        'INSERT INTO users (name, email, password) VALUES (?, ?, ?)',
        [req.body.name, req.body.email, req.body.password],
        (err) => {
            if (err) {
                // Handle error by sending a response
                console.error('Error inserting user:', err);
                res.status(500).send('Error registering user');
            } else {
                // Successfully registered
                res.send('User registered!');
            }
        }
    );
};




const userLogin = (req, res) => {
    // Implement login logic here
};

const userGet = (req, res) => {
    // Implement get user logic here
};

module.exports = { userRegister, userLogin, userGet };
