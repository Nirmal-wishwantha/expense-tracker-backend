const express = require('express');
const router = express.Router();

const { userRegister, userLogin, userGet } = require('../controllers/user-controller');


router.post('/register', userRegister);

router.post('/login', userLogin);

// router.get('/get/:id', userGet);

module.exports = router;