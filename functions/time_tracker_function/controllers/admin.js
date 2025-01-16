var catalyst = require('zcatalyst-sdk-node');
const {sendErrorResponse} = require('../utils/error');
const {sendOtp, verifyOtp} = require('../controllers/otpHandle');

async function handleForgotPassword(req, res) {
    const email = req.body.email;

    if (!email) {
        return res.status(400).json({ status: 'error', message: 'Email is required' });
    }

    try {
        const otpSentRes = await sendOtp(req, res);

        console.log("OTP Sent Response:", otpSentRes);

        if (otpSentRes && otpSentRes.status === 'success') {
            return res.status(200).json(otpSentRes);
        } else {
            return res.status(400).json({ status: 'error', message: otpSentRes?.message || 'Failed to send OTP' });
        }
    } catch (error) {
        console.error('Error handling forgot password:', error.message);

        return res.status(500).json({ 
            status: 'error', 
            message: 'An error occurred while processing your request. Please try again later.' 
        });
    }
}


async function handleVerifyOTP(req, res) {
    try{
        const verificationOTP = await verifyOtp(req,res)
        console.log("Email verified",verificationOTP);
        res.send(otpSentRes);
    }catch(error){
        console.error('Error handling forgot password:', error.message);
        return res.status(500).json({ status: 'error', message: 'An error occurred. Please try again.' });
    }
}

async function handleAdminLogin(req, res) {

    const { email, password } = req.body
    var app = catalyst.initialize(req);
   

}

module.exports = {
    handleAdminLogin,
    handleForgotPassword,
    handleVerifyOTP
}