//This file contains the logic for generating and verifying OTPs for email verification during user registration. It uses the otp-generator package to create random OTPs, bcrypt to hash them before storing in the database, and a custom sendMail utility to send the OTP to the user's email. The OTP is valid for a single use and is deleted from the database after successful verification. The controller also checks if the user exists and if their email is already verified before generating a new OTP.

const otpGenerator = require('otp-generator')
const OTP = require('../models/otpModel');
const {sendMail} = require('../utils/sendMail');        
const User = require('../models/User');             
const { otpTemplate } = require('../utils/emailTemplates/otpTemplate');
const bcrypt = require('bcrypt');


exports.generateOTP = async (request, response) => {

  //It takes the userId from the request body, checks if the user exists and is not already verified, generates a 6-digit OTP using otp-generator, hashes it, stores it in the database associated with the userId, and sends the OTP to the user's email using a predefined email template.

  try {
    const { userId } = request.body;
    const user = await User.findById(userId);

    if (!user) {
      return response.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // fix 2: check isVerified AFTER confirming user exists
    if (user.isVerified) {
      return response.status(400).json({
        success: false,
        message: "Email already verified",
      });
    }

    const otp = otpGenerator.generate(6, {
      upperCaseAlphabets: false,
      specialChars: false,
      lowerCaseAlphabets: false
    });

    const otpHash = await bcrypt.hash(otp, 10);

    // delete any existing OTP for this user before creating new one
    // prevents multiple valid OTPs existing at the same time
    await OTP.deleteOne({ userId });

    const newOTP = new OTP({
      userId: userId,
      otp: otpHash,
    });

    await newOTP.save();

    await sendMail(
      user.email,
      "Your OTP for Digifello AI Account Verification",
      otpTemplate(user, otp)
    );

    return response.status(200).json({
      success: true,
      message: "OTP sent to your email successfully",
    });

  } catch (err) {
    console.error("generateOTP error:", err);
    return response.status(500).json({
      success: false,
      message: "Error generating OTP. Please try again.",
    });
  }
};


exports.verifyOTP = async (request, response) => {
    //This section takes the userId and the OTP entered by the user from the request body, retrieves the stored hashed OTP from the database, compares it with the entered OTP using bcrypt, and if they match, it marks the user's email as verified in the database and deletes the OTP record. If any step fails (e.g., user not found, OTP not found, OTP mismatch), it returns an appropriate error response.
    
  try {
    const { otpReceiver, userId } = request.body;

    // find user first
    const user = await User.findById(userId);

    if (!user) {
      return response.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // find stored OTP
    const otpStored = await OTP.findOne({ userId });

    if (!otpStored) {
      return response.status(404).json({
        success: false,
        message: "OTP not found or expired",
      });
    }

    // compare OTP
    const isMatched = await bcrypt.compare(otpReceiver, otpStored.otp);

    if (!isMatched) {
      return response.status(400).json({
        success: false,
        message: "Invalid OTP",
      });
    }

    
    await OTP.deleteOne({ userId });

    // mark user as verified
    user.isVerified = true;
    await user.save();

    return response.status(200).json({
      success: true,
      message: "Email verified successfully",
    });

  } catch (err) {
    console.error("verifyOTP error:", err);
    return response.status(500).json({
      success: false,
      message: "Error verifying OTP. Please try again.",
    });
  }
}