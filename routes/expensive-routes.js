const express = require('express');
const router = express.Router();

const { addExpensive, deleteExpensive, updateExpensive, getExpensive } = require('../controllers/expensice-controller');

router.post('/add', addExpensive);

router.delete('/delete/:id', deleteExpensive);

router.put('/update/:id', updateExpensive);

router.get('/get/:id?', getExpensive);

module.exports = router;
