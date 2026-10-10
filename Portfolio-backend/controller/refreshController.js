const jwt = require("jsonwebtoken");
const dotenv = require("dotenv").config();
const JWT_SECRET = process.env.JWT_SECRET;
const tokenFamily = require("../models/TokenFamily");
const {sendMail} = require("../utils/sendMail");
const User = require("../models/User");
const { generateTokens } = require("../utils/generateTokens");
const { alertTemplate } = require("../utils/emailTemplates/securityAlert");
const crypto = require("crypto");

const hashToken = (token) =>
  crypto.createHash("sha256").update(token).digest("hex");

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

  if (!decoded) {
    return response.status(401).json({
      success: false,
      message: "Invalid refresh token",
    });
  }
  const user = { userId: decoded.userId };

  if (!user.userId) {
    return response.status(401).json({
      success: false,
      message: "Invalid refresh token",
    });
  }

  jwt.verify(refreshToken, process.env.REFRESH_SECRET, async (err, decoded) => {
    const Family = await tokenFamily.findOne({ userId: user.userId });

    if (!Family) {
      return response.status(401).json({
        success: false,
        message: "Invalid refresh token",
      });
    }

    // Check if token matches current token
    const incomingHash = hashToken(refreshToken);
    const isCurrentToken = incomingHash === Family.currentToken;
  

    if (!isCurrentToken) {
      // Check if token exists in old family (reuse/theft attack)
      let isOldToken = false;
      for (const oldHash of Family.tokenFamily) {
        const match = incomingHash === oldHash;
        if (match) {
          isOldToken = true;
          break;
        }
      }

      if (isOldToken) {
        // ATTACK DETECTED
        const foundUser = await User.findById(user.userId);
        await tokenFamily.deleteOne({ userId: user.userId });

        try {
          await sendMail(
            foundUser.email,
            "⚠️ Suspicious Login Activity Detected on Your Account",
            alertTemplate(foundUser, request), // pass foundUser not User
          );
        } catch (mailErr) {
        }

        return response.status(419).json({
          success: false,
          message:
            "Refresh token reuse detected. All tokens have been revoked.",
        });
      }
      // Token just doesn't match — invalid
      return response.status(401).json({
        success: false,
        message: "Invalid refresh token",
      });
    }

    // Token matched current — now check if it's expired
    if (err) {
      return response.status(401).json({
        success: false,
        message: "Invalid or expired refresh token",
      });
    }


    // All good — generate new tokens
    const newAccessToken = jwt.sign(
      { userId: user.userId, jti: crypto.randomUUID() },
      JWT_SECRET,
      {
        expiresIn: "15m",
      },
    );

    const newRefreshToken = jwt.sign(
      { userId: user.userId, jti: crypto.randomUUID() },
      process.env.REFRESH_SECRET,
      {
        expiresIn: "7d",
      },
    );

    const hashedRefreshToken = hashToken(newRefreshToken);

    // Move current to family history before replacing

    Family.tokenFamily.push(Family.currentToken);
    Family.currentToken = hashedRefreshToken;

    if (Family.tokenFamily.length > 5) {
      Family.tokenFamily.shift();
    }
    await Family.save();
    const updated = await tokenFamily.findOne({ userId: user.userId });


    return response.status(200).json({
      success: true,
      accessToken: newAccessToken,
      refreshToken: newRefreshToken,
    });
  });
};