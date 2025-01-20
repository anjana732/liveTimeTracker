var catalyst = require('zcatalyst-sdk-node');
const {sendErrorResponse} = require('../utils/error');
const {sendOtp, verifyOtp, sen} = require('../controllers/otpHandle');
const crypto = require('crypto');
const bcrypt = require('bcrypt')
const {hashPassword} = require('../controllers/encryptPassword')



async function handleForgotPassword(req, res) {
    console.log("inside handleForgotPassword")
    const email = req.body.email;

    if (!email) {
        return res.status(400).json({ status: 'error', message: 'Email is required' });
    }

    try {
        var  otpSentRes = await sendOtp(req, res);
       
        console.log("OTP Sent Response: from handleForogotPassword", otpSentRes);

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


// async function handleVerifyOTP(req, res) {
//     console.log("insilde handleVerifyOTP")
//     try{
//         const verificationOTP = await verifyOtp(req,res)
//         console.log("Email verified",verificationOTP);
//         // res.send(otpSentRes);
//     }catch(error){
//         console.error('Error handling forgot password:', error.message);
//         // return res.status(500).json({ status: 'error', message: 'An error occurred. Please try again.' });
//     }
// }

async function handleVerifyOTP(req, res) {
    console.log("inside handleVerifyOTP");
    try {
        
        await verifyOtp(req, res);
        console.log("OTP verification process completed.");
    } catch (error) {
        console.error('Error during OTP verification:', error.message);
        return res.status(500).json({ status: 'error', message: 'An error occurred. Please try again.' });
    }
}


function resetPassword(catalystApp, email, password) {
    console.log(`Recieives Data in resetPassword: email: ${email} , Pass: ${password}`)
    return new Promise((resolve, reject) => {
        const query = `UPDATE Admin SET password = '${password}'WHERE email = '${email}'`;

        console.log('Executing update query:', query);
        
        catalystApp.zcql().executeZCQLQuery(query)
            .then(queryResponse => {
                console.log('Find user response:', queryResponse);
                resolve(queryResponse);
            })
            .catch(err => {
                console.error('Database error finding user:', err);
                reject(err);
            });
    });
}

async function handleResetPassword(req, res){
    const {password, email} = req.body
    console.log(`Email: ${email}, Password: ${password}`)
    const hashedPassword = await hashPassword(password);
    try{
    const catalystApp = catalyst.initialize(req);
    const admin = await resetPassword(catalystApp, email, hashedPassword);

    console.log('Reset attempt:', {
        providedEmail: email,
        providedPassword: password,
        userFound: !!admin,
        adminData: admin?.[0]?.Admin,
    });

    const adminData = admin[0].Admin;

    if (!admin || admin.length === 0) {
        throw new Error('Admin not found');
    }

    res.status(200).json({
        status: "success",
        data: {
            ROWID: adminData.ROWID,
            userName: adminData.userName,
            email: adminData.email,
            name: adminData.userName,
            // role: "intern"
        }
    });
}catch(err){
    console.error("Reset Password error:", err);
    res.status(401).json({
        status: "error",
        message: err.message || "Can't Reset Password"
    });
}

}


// async function handleResetPassword(req, res) {
//     const { password, email } = req.body;

//     if (!email || !password) {
//         return res.status(400).json({
//             status: "error",
//             message: "Email and password are required"
//         });
//     }

//     try {
//         const hashedPassword = await hashPassword(password);
//         const catalystApp = catalyst.initialize(req);
//         const admin = await resetPassword(catalystApp, { email, password: hashedPassword });

//         if (!admin || admin.length === 0) {
//             throw new Error('Admin not found');
//         }

//         const adminData = admin[0].Admin;

//         console.log('Reset attempt:', {
//             providedEmail: email,
//             userFound: !!admin,
//             adminData,
//         });

//         res.status(200).json({
//             status: "success",
//             data: {
//                 ROWID: adminData.ROWID,
//                 userName: adminData.userName,
//                 email: adminData.email,
//                 name: adminData.userName,
//             }
//         });
//     } catch (err) {
//         console.error("Reset Password error:", err);
//         res.status(401).json({
//             status: "error",
//             message: err.message || "Can't Reset Password"
//         });
//     }
// }


function findUserByEmail(catalystApp, email) {
    return new Promise((resolve, reject) => {
        const query = `SELECT * FROM Admin WHERE EMAIL = '${email}'`;
        
        console.log('Executing find user query:', query);
        
        catalystApp.zcql().executeZCQLQuery(query)
            .then(queryResponse => {
                console.log('Find user response:', queryResponse);
                resolve(queryResponse);
            })
            .catch(err => {
                console.error('Database error finding user:', err);
                reject(err);
            });
    });
}
async function handleAdminLogin(req, res) {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({
            status: "error",
            message: "Email and password are required"
        });
    }

    try {
      
        const catalystApp = catalyst.initialize(req);
        const user = await findUserByEmail(catalystApp, email);

        console.log('Login attempt:', {
            providedEmail: email,
            providedPassword: password,
            userFound: !!user,
            userData: user?.[0]?.Admin,
        });

        if (!user || user.length === 0) {
            throw new Error('User not found');
        }

        const userData = user[0].Admin;

         const passwordMatch = await bcrypt.compare(password, userData.password);

        console.log('Password comparison:', {
            providedPassword: password,
            storedPassword: userData.password,
             passwordMatch,
        });

        if (!passwordMatch) {
            throw new Error('Invalid password');
        }

        res.status(200).json({
            status: "success",
            data: {
                ROWID: userData.ROWID,
                userName: userData.userName,
                email: userData.email,
                name: userData.userName,
                role: "intern"
            }
        });
    } catch (err) {
        console.error("Login error:", err);
        res.status(401).json({
            status: "error",
            message: err.message || "Invalid credentials"
        });
    }
}

module.exports = {
    handleAdminLogin,
    handleForgotPassword,
    handleVerifyOTP,
    handleAdminLogin,
    handleResetPassword
}