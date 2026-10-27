const user = require("../models/user");
const otp = require('../models/user');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const {sendOTPEmail} = require('../utils/email');

const generateToken = (id, role) => {
    return jwt.sign({ id, role }, process.env.JWT_SECRET, { expiresIn: '7d' });
}

//register user
exports.registerUser = async (req, res) => {
  const { name, email, password } = req.body;

  let userExists = await user.findOne({ email });
  if (userExists) {
    return res.status(400).json({ message: "User already exists" });
  }

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);
  try {
    const user = new user.create({ name, email, password: hashedPassword, roler: 'user', isverified: false });

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    console.log(`OTP for ${email}: ${otp} `);
    await otp.create({email, otp, action: 'account_verification'});
    await sendOTPEmail(email, otp, 'account_verification');

    res.status(201).json({
        message: 'user registered successfully. please check your email for otp to verify your account.',
        email: user.email
    });

    

    



  } catch (error) {
    res.status(400).json({ error: error.message});
  }
};


// login user
exports.loginUser = async (req, res) => {
  const { email, password } = req.body;

  let user = await user.findOne({ email });
  if (!user) {
    return res.status(400).json({ message: "Invalid credentials , please sign up first" });
  }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }  
    
    if (!user.isverified && user.role === 'user') {
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        await otp.deleteMany({ email, action: 'account_verification' }); // Remove any existing OTPs for this email 

        await otp.create({ email, otp, action: 'account_verification' });
        await sendOTPEmail(email, otp, 'account_verification');
        return res.status(400).json({ message: "Account not verified. Please check your email for OTP to verify your account." });
    }

    res.json({
        message: "Login successful",
        user: {
            id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            token: generateToken(user._id, user.role)
        }
    });
};

    //verify otp
    exports.verifyOtp = async (req, res) => {
        const { email, otp } = req.body;
        const otpRecord = await otp.findOne({ email, otp, action: 'account_verification' });
        if (!otpRecord) {
            return res.status(400).json({ message: "Invalid or expired OTP" });
        }
    

    const user = await user.findOne({ email }, { isverified: true });
    await otp.deleteMany({ email, action: 'account_verification' }); // Remove the OTP after successful verification    

    res.json({
         message: "Account verified successfully. You can now log in.",
         id: user._id,
         name: user.name,
         email: user.email,
         role: user.role,
         token: generateToken(user._id, user.role)
        });
    };

