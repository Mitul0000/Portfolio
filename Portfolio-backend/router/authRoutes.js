//External modules
const express = require('express');

//Internal modules
const { createUser, loginUser, logoutUser, forgotPassword, resetLinkHandler } = require('../controller/authController');
const { generateOTP, verifyOTP } = require('../controller/otpController');
const { isAuth } = require('../middleware/isAuth');
const {refreshToken} = require("../controller/refreshController")
const authRoutes = express.Router();

//public routes
authRoutes.post('/register', createUser);
authRoutes.post('/login', loginUser);
authRoutes.post('/generate-otp', generateOTP);
authRoutes.post('/verify-otp', verifyOTP);
authRoutes.post('/forgot-password', forgotPassword);
authRoutes.post('/reset-password/:id/:token',resetLinkHandler);
authRoutes.post("/refresh",refreshToken);
//private routes
authRoutes.post('/logout',isAuth,logoutUser);

module.exports = authRoutes;
