const dotenv = require("dotenv").config();
const jwt = require("jsonwebtoken");
const JWT_SECRET = process.env.JWT_SECRET;
const TokenFamily = require("../models/TokenFamily");
const REFRESH_SECRET = process.env.REFRESH_SECRET;
const bcrypt = require("bcrypt");
const crypto = require("crypto");


exports.generateTokens = async (user) => {
  const accessToken = jwt.sign(
    { userId: user._id, email: user.email,jti: crypto.randomUUID(), },
    JWT_SECRET,
    { expiresIn: "5s" },
  );
  const refreshToken = jwt.sign(
    { userId: user._id, email: user.email,jti: crypto.randomUUID() },
    REFRESH_SECRET,
    { expiresIn: "7d" },
  );

  const hashedRefreshToken = await bcrypt.hash(refreshToken, 12);

  await TokenFamily.findOneAndUpdate(
    { userId: user._id },
    {
      currentToken: hashedRefreshToken,
      tokenFamily: [],
    },
    { upsert: true, returnDocument: 'after' },
  );

  return {
    accessToken,
    refreshToken,
  };
};
