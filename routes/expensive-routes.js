const express = require('express');
const router = express.Router();

const { addExpensive, deleteExpensive, updateExpensive, getExpensive } = require('../controllers/expensice-controller');

// Route to add an expense
router.post('/add', addExpensive);

// Route to delete an expense (using DELETE method with id as a route parameter)
router.delete('/delete/:id', deleteExpensive);

// Route to update an expense (using PUT method with id as a route parameter)
router.put('/update/:id', updateExpensive);

// Route to get all expenses or a specific expense by id
router.get('/get/:id?', getExpensive);

module.exports = router;
