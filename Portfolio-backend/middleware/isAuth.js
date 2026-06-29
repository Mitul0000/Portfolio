const jwt = require("jsonwebtoken");
const User = require("../models/User");

exports.isAuth = async (request, response, next) => {

  // This is a middleware which taken token from the frontend and then it decodes it and find the user from the decoded userId. Then it attaches the user in the request and goes to the next middleware.If token or user is not found then it returns error to the front end.
  const authHeader = request.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return response.status(401).json({
      success: false,
      message: "Authorization header is missing or malformed",
    });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const userFound = await User.findById(decoded.userId);


    if (!userFound) {
      return response.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    request.user = userFound;
    next();
  } catch (err) {
    console.log("Access token exxpired or invalid");
    return response.status(401).json({
      success: false,
      message: "Invalid or expired token",
    });
  }
};
