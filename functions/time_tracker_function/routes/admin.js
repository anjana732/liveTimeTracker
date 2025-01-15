const express = require('express');
const {handleForgotPassword} = require('../controllers/admin');

const router =  express.Router();

router.post('/forgotPassword', handleForgotPassword);

module.exports = router

