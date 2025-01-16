const express = require('express');
const {handleForgotPassword, handleVerifyOTP, handleAdminLogin, handleResetPassword} = require('../controllers/admin');

const router =  express.Router();

router.post('/forgotPassword', handleForgotPassword);
router.post('/verifyOTP',handleVerifyOTP);
router.post('/adminLogin',handleAdminLogin);
router.put('/resetPassword',handleResetPassword)

module.exports = router;

