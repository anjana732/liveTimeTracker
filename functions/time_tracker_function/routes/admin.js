const express = require('express');
const {handleForgotPassword, handleVerifyOTP} = require('../controllers/admin');

const router =  express.Router();

router.post('/forgotPassword', handleForgotPassword);
router.post('/verifyOTP',handleVerifyOTP);

module.exports = router;

