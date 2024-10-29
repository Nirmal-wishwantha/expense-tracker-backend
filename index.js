const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors'); // Import cors
const setupDatabase = require('./db/db-setup');

const app = express();
const port = 3000;

// Setup database connection
setupDatabase();

// Configure CORS options
const corsOptions = {
  origin: 'http://localhost:5173', // Allow requests from this origin
  methods: ['GET', 'POST', 'PUT', 'DELETE'], // Allow only these HTTP methods
  allowedHeaders: ['Content-Type', 'Authorization'], // Allow specific headers
};

// Use CORS with the specified options
app.use(cors(corsOptions)); // Enable CORS for all routes with options

app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true })); // Enables parsing of URL-encoded data
app.use(bodyParser.json()); // Enables parsing of JSON data

// Define routes
const userRoute = require('./routes/users-routs');
app.use('/api/v1/user', userRoute);

const expensiveRoute = require('./routes/expensive-routes');
app.use('/api/v1/expens', expensiveRoute);

// Start the server
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
