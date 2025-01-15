var catalyst = require('zcatalyst-sdk-node');
const {sendErrorResponse} = require('../utils/error');
const {sendOtp, verifyOtp} = require('../controllers/otpHandle');
const { verifyOtp } = require('./user');


async function handleForgotPassword(req, res){
    const email = req.body.email;

    if (!email) {
        return res.status(400).json({ status: 'error', message: 'Email is required' });
    }
    try {
        const otpSentRes =  await sendOtp(req,res)
        console.log("Otp Sent Res", otpSentRes)
        res.send(otpSentRes);
    } catch (error) {
        console.error('Error handling forgot password:', err.message);
        return res.status(500).json({ status: 'error', message: 'An error occurred. Please try again.' });
    }

    
}

async function handleAdminLogin(req, res) {

    const { email, password } = req.body
    var app = catalyst.initialize(req);
   

}

module.exports = {
    handleAdminLogin,
    handleForgotPassword
}