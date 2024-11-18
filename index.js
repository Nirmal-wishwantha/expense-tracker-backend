const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const setupDatabase = require('./db/db-setup');

const app = express();
const port = 3000;

setupDatabase();

const corsOptions = {
  origin: 'http://localhost:5173', 
  methods: ['GET', 'POST', 'PUT', 'DELETE'], 
  allowedHeaders: ['Content-Type', 'Authorization'], 
};

app.use(cors(corsOptions));

app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json()); 

const userRoute = require('./routes/users-routs');
app.use('/api/v1/user', userRoute);

const expensiveRoute = require('./routes/expensive-routes');
app.use('/api/v1/expens', expensiveRoute);


app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
