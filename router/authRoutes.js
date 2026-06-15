//External modules
const express = require('express');

//Internal modules
const { createUser, loginUser, logoutUser } = require('../controller/authController');
const { generateOTP, verifyOTP } = require('../controller/otpController');
const { isAuth } = require('../middleware/isAuth');

const authRoutes = express.Router();

//public routes
authRoutes.post('/register', createUser);
authRoutes.post('/login', loginUser);
authRoutes.post('/generate-otp', generateOTP);
authRoutes.post('/verify-otp', verifyOTP);

//private routes
authRoutes.post('/logout',isAuth,logoutUser);

module.exports = authRoutes;
