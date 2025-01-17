const nodemailer = require('nodemailer');
const crypto = require('crypto');

const sendOtpToEmail = async (email) => {
    const otp = Math.floor(100000 + Math.random() * 900000);
    const expirationTime = Date.now() + 5 * 60 * 1000; 

    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'testzohoacc81@gmail.com',
            pass: 'deoddzoocywgsrzk',
        },
    });

   
    const mailOptions = {
        from: 'testzohoacc81@gmail.com', 
        to: email,
        subject: 'Your OTP for Signup Verification',
        text: `Your OTP for email verification is: ${otp}. It is valid for 5 minutes.`,
    };

    try {
       
        await transporter.sendMail(mailOptions);
        console.log(`OTP sent successfully to ${email}`);
        return { otp, expirationTime };
    } catch (error) {
        console.error(`Failed to send OTP to ${email}:`, error);
        throw new Error('Failed to send OTP. Please try again later.');
    }
};


const otpStore = new Map(); 

async function sendOtp(req, res) {
   
    const {email} = req.body

    console.log("email received :", email);
    try {
        const { otp, expirationTime } = await sendOtpToEmail(email);

        otpStore.set(email, { otp, expirationTime });

        return { status: 'success', message: 'OTP sent successfully to your email' };
    } catch (err) {
        console.error('Error sending OTP:', err);
        return { status: 'error', message: 'Failed to send OTP. Please try again.' };
    }
}

const verifyOtp = (req, res) => {
    const { email, otp } = req.body;

    console.log('Incoming request:', { email, otp });

    if (!otpStore.has(email)) {
        // console.log(`Email not found in otpStore. Available keys: ${Array.from(otpStore.keys()).join(', ')}`);
        return res.status(400).json({ status: 'error', message: 'Invalid email' });
    }

    const { otp: storedOtp, expirationTime } = otpStore.get(email);

    // console.log(`Received OTP: "${otp}", Stored OTP: "${storedOtp}"`);
    // console.log(`Received OTP Type: ${typeof otp}, Stored OTP Type: ${typeof storedOtp}`);
    // console.log(`Expiration Time: ${expirationTime}, Current Time: ${Date.now()}`);

    if (otp.toString().trim() !== storedOtp.toString().trim()) {
        console.log('OTP mismatch detected.');
        return res.status(400).json({ status: 'error', message: 'Invalid OTP' });
    }

    if (Date.now() > expirationTime) {
        console.log('OTP expired.');
        return res.status(400).json({ status: 'error', message: 'OTP expired' });
    }

    otpStore.delete(email); 
    console.log(`OTP verified successfully for ${email}`);
    return res.status(200).json({ status: 'success', message: 'OTP verified successfully' });
};

module.exports = {
    sendOtp,
    verifyOtp
}