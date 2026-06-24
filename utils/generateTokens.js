const dotenv = require("dotenv").config();
const jwt = require("jsonwebtoken");
const JWT_SECRET = process.env.JWT_SECRET;
const TokenFamily = require("../models/TokenFamily");
const REFRESH_SECRET = process.env.REFRESH_SECRET;
const bcrypt = require("bcrypt");

exports.generateTokens = async (user) => {
  const accessToken = jwt.sign(
    { userId: user._id, email: user.email },
    JWT_SECRET,
    { expiresIn: "5s" },
  );
  const refreshToken = jwt.sign(
    { userId: user._id, email: user.email },
    REFRESH_SECRET,
    { expiresIn: "7d" },
  );

  const hashedRefreshToken = await bcrypt.hash(refreshToken, 12);

  await TokenFamily.findOneAndUpdate(
    { userId: user._id },
    {
      currentToken: hashedRefreshToken,
      tokenFamily: [hashedRefreshToken],
    },
    { upsert: true, new: true },
  );

  return {
    accessToken,
    refreshToken,
  };
};
