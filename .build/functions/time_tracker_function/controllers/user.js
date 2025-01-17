const catalyst = require('zcatalyst-sdk-node');
const {sendErrorResponse} = require('../utils/error')
const bcrypt = require('bcrypt')
const nodemailer = require('nodemailer');
const crypto = require('crypto');


const ADMIN_EMAIL = 'admin@timetracker.com';
const ADMIN_PASSWORD = 'admin123';


function findUserByEmail(catalystApp, email) {
    return new Promise((resolve, reject) => {
        const query = `SELECT * FROM Users WHERE EMAIL = '${email}'`;
        
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
    const { email } = req.body;

    if (!email) {
        return res.status(400).json({ status: 'error', message: 'Email is required' });
    }

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
        console.log(`Email not found in otpStore. Available keys: ${Array.from(otpStore.keys()).join(', ')}`);
        return res.status(400).json({ status: 'error', message: 'Invalid email' });
    }

    const { otp: storedOtp, expirationTime } = otpStore.get(email);

    console.log(`Received OTP: "${otp}", Stored OTP: "${storedOtp}"`);
    console.log(`Received OTP Type: ${typeof otp}, Stored OTP Type: ${typeof storedOtp}`);
    console.log(`Expiration Time: ${expirationTime}, Current Time: ${Date.now()}`);

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


const hashPassword = async (password) => {
    try {
      const saltRounds = 10; 
      const hashedPassword = await bcrypt.hash(password, saltRounds);
      console.log("Hashed Password:", hashedPassword);
      return hashedPassword;
    } catch (error) {
      console.error("Error hashing password:", error);
      throw error;
    }
  };
  

// async function handleUserSignup(req, res) {
//     const {userName, firstName,lastName , email, password} = req.body;
//     console.log("data in req.body",req.body);

//     sendOtp(req,res);

//     const hashedPassword = await hashPassword(password);
//     console.log(hashedPassword);

//     if (!firstName|| !lastName || !email || !password) {
//         return res.status(400).json({
//             status: "error",
//             message: "userName, email, and password are required"
//         });
//     }

//     const catalystApp = catalyst.initialize(req);
//     try {
//         const result = await addUser(catalystApp, {userName, firstName,lastName, email, password: hashedPassword});
//         console.log("User signup successful:", result);
//         res.status(200).json({
//             status: "success",
//             message: "User registered successfully",
//             data: result
//         });
//     } catch (err) {
//         console.error("Signup error:", err);
//         res.status(500).json({
//             status: "error",
//             message: err.message || "Failed to register user"
//         });
//     }
// }

async function handleUserSignup(req, res) {
    const { userName, firstName, lastName, email, password } = req.body;

    if (!userName || !firstName || !lastName || !email || !password) {
        return res.status(400).json({
            status: "error",
            message: "userName, firstName, lastName, email, and password are required"
        });
    }

    const catalystApp = catalyst.initialize(req);

    try {
        const otpResponse = await sendOtp(req, res);
        if (otpResponse.status === 'error') {
            return res.status(500).json(otpResponse);
        }
        const hashedPassword = await hashPassword(password);

      
        const result = await addUser(catalystApp, { userName, firstName, lastName, email, password: hashedPassword });

        res.status(200).json({
            status: "success",
            message: "User registered successfully. OTP sent to your email.",
            data: result,
        });
    } catch (err) {
        console.error("Signup error:", err);
        res.status(500).json({
            status: "error",
            message: err.message || "Failed to register user"
        });
    }
}


async function handleUserLogin(req, res) {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({
            status: "error",
            message: "Email and password are required"
        });
    }

    try {
      
        if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
            return res.status(200).json({
                status: "success",
                data: {
                    ROWID: "admin_1",
                    userName: "admin",
                    email: ADMIN_EMAIL,
                    name: "Admin",
                    role: "admin"
                }
            });
        }

        const catalystApp = catalyst.initialize(req);
        const user = await findUserByEmail(catalystApp, email);

        console.log('Login attempt:', {
            providedEmail: email,
            providedPassword: password,
            userFound: !!user,
            userData: user?.[0]?.Users,
        });

        if (!user || user.length === 0) {
            throw new Error('User not found');
        }

        const userData = user[0].Users;

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

async function handleGetUser(req, res) {
    const catalystApp = catalyst.initialize(req);
    await getUsers(catalystApp)
        .then(resp => {
            console.log("Users fetched successfully:", resp);
            res.send({
                message: "Users fetched successfully",
                data: resp
            });
        })
        .catch(err => {
            console.error(err);
            sendErrorResponse(res);
        });
}

function getUsers(catalystApp) {
    return new Promise((resolve, reject) => {
        const query = `SELECT ROWID, USERNAME, EMAIL FROM Users`;
        console.log('Fetching all users:', query);
        
        catalystApp.zcql().executeZCQLQuery(query)
            .then(queryResponse => {
                console.log('Users fetched:', queryResponse);
                resolve(queryResponse);
            })
            .catch(err => {
                console.error('Error fetching users:', err);
                reject(err);
            });
    });
}

function addUser(catalystApp, {userName,firstName,lastName, email, password}) {
    return new Promise((resolve, reject) => {
 
        const checkQuery = `SELECT * FROM Users WHERE EMAIL = '${email}'`;
        
        console.log('Checking for existing user:', checkQuery);
        
        catalystApp.zcql().executeZCQLQuery(checkQuery)
            .then(existingUser => {
                if (existingUser && existingUser.length > 0) {
                    reject(new Error('User with this email already exists'));
                    return;
                }

               
                const query = `
                    INSERT INTO Users
                    (userName, firstName, lastName, email, password) 
                    VALUES 
                    ('${userName}','${firstName}','${lastName}', '${email}', '${password}')
                `;

                console.log('Inserting new user:', query);
                return catalystApp.zcql().executeZCQLQuery(query);
            })
            .then(queryResponse => {
                console.log('User added successfully:', queryResponse);
                resolve(queryResponse);
            })
            .catch(err => {
                console.error('Database error:', err);
                reject(err);
            });
    });
}

module.exports = {
    handleUserSignup,
    handleGetUser,
    handleUserLogin,
    findUserByEmail ,
    verifyOtp 
}
