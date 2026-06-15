const jwt = require("jsonwebtoken");
const dotenv = require("dotenv").config();
const JWT_SECRET = process.env.JWT_SECRET;
const tokenFamily = require("../models/TokenFamily");
const sendMail = require("../utils/sendMail");
const User = require("../models/User");
const { generateTokens } = require("../utils/generateTokens");
const alertTemplate = require("../utils/alertTemplate");
const bcyrpt = require('bcrypt')

exports.refreshToken = async (request, response) => {
  //This function takes refresh token from the frontend. It decodes the token and find the userId. After the the refresh token is verified the tokenfamily is found using the user id. If the current token of the family does not match with the receive token but it is found in the array of the token which means that the token was stolen. In other cases the token is expired and invalid. If is passes all then new access and refresh token is generated and it is sent to the frontend.

  // decode is done before beacuse if verify function finds an error then it will not have decode value. and witohut that we will not get the user id and the family. So we will not be able to compare and find the attack.

  const { refreshToken } = request.body;

  if (!refreshToken) {
    return response.status(400).json({
      success: false,
      message: "Refresh token is required",
    });
  }

  const decoded = jwt.decode(refreshToken);

  if(!decoded){
    return response.status(401).json({
      success: false,
      message: "Invalid refresh token",
    });
  }
  const user = { userId: decoded.userId };

  if(!user.userId){
    return response.status(401).json({
      success: false,
      message: "Invalid refresh token",
    });
  }

  jwt.verify(refreshToken, JWT_SECRET, async(err,decoded) =>{

    const Family = await tokenFamily.findOne({ userId: user.userId});

    if(!Family){
      return response.status(401).json({
        success: false,
        message: "Invalid refresh token",
      });
    }

    const hashedOldToken = await bcyrpt.hash(refreshToken,12)

    if(hashedOldToken !== Family.currentToken && Family.tokenFamily.includes(hashedOldToken)){

      const foundUser =await User.findById(user.userId);

      //attack detected. Alert needs to be sent and all tokens in the family needs to be revoked
      Family.tokenFamily = [];
      Family.currentToken = null;
      await Family.save();

      await sendMail(
        foundUser.email,
        "⚠️ Suspicious Login Activity Detected on Your Account",
        alertTemplate(User,request)
      ); 
      
      return response.status(419).json({
        success: false,
        message: "Refresh token reuse detected. All tokens have been revoked.",
      });

    }else{
      if (err) {
        return response.status(401).json({
          success: false,
          message: "Invalid or expired refresh token",
        });
      }
      if (Family.currentToken !== hashedOldToken) {
        return response.status(401).json({
          success: false,
          message: "Invalid refresh token",
        });
      }
    }    

    // If the token is valid, generate a new access token
    const newAccessToken = jwt.sign(
      { userId: user.userId },
      JWT_SECRET,
      { expiresIn: "15m" }
    );
    const newRefreshToken = jwt.sign(
      { userId: user.userId },
      JWT_SECRET,
      { expiresIn: "7d" }
    );

    const hashedRefreshToken = await bcyrpt.hash(newRefreshToken,12);

    Family.currentToken = hashedRefreshToken;
    Family.tokenFamily.push(hashedRefreshToken);
    if(Family.tokenFamily.length > 5){
      Family.tokenFamily.shift(); // Remove the oldest token to maintain a maximum of 5 tokens in the family
    }
    await Family.save();
    response.status(200).json({
      success: true,
      accessToken: newAccessToken,
      refreshToken: newRefreshToken
    });
 });};