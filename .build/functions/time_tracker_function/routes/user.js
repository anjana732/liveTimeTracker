const express = require('express');
const { handleUserSignup, handleGetUser, handleUserLogin, verifyOtp  } = require('../controllers/user');

const router = express.Router();


router.post('/signup', handleUserSignup);
router.post('/login', handleUserLogin);
router.get('/', handleGetUser);
router.post('/otp',verifyOtp);


module.exports = router; 