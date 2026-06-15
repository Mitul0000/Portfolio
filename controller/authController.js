// This file has three functions which includes resister,login and logout.


const User = require("../models/User");
const bcrypt = require("bcrypt");
const { check, validationResult } = require("express-validator");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv").config();
const JWT_SECRET = process.env.JWT_SECRET;
const { generateTokens } = require("../utils/generateTokens");
const TokenFamily = require("../models/TokenFamily")

exports.createUser = [
  // This function takes firstName,lastName,email,terms and password from the frontend and validate them with specific conditions using express-validator.If it fails to meet the condition then respective error message is sent to the frontend. If there is no error then the details are saved in database. And if there is email dublication error then it is handled separately in the catch blog.

  check("firstName")
    .notEmpty()
    .withMessage("First name is required")
    .trim()
    .isLength({ min: 2 })
    .withMessage("First name must be atleast 2 charecters long")
    .matches(/^[a-zA-Z\s]+$/)
    .withMessage("First name can only contain letters"),

  //Email validation
  check("email")
    .isEmail()
    .withMessage("Please enter a valid email")
    .normalizeEmail(),

  //Last name validation
  check("lastName")
    .notEmpty()
    .withMessage("Last name cannot be empty")
    .trim()
    .isLength({ min: 2 })
    .withMessage("Last name must be atleast 2 charecters long")
    .matches(/^[a-zA-Z\s]+$/)
    .withMessage("last name can only contain letters"),

  //Password validation
  check("password")
    .isLength({ min: 8 })
    .withMessage("Password must be atlease 8 charecters long")
    .matches(/[a-z]/)
    .withMessage("Password must contain a lowercase letter")
    .matches(/[A-Z]/)
    .withMessage("Passsword must contain a upper case letter")
    .matches(/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/)
    .withMessage("Password must contain a special character"),

  //Confirm password validation
  check("confirmPassword")
    .trim()
    .custom((value, { req }) => {
      if (value !== req.body.password) {
        throw new Error("Passwords do not match");
      } else {
        return true;
      }
    }),

  //Terms accepted validation
  check("terms").custom((value) => {
    if (value !== true) {
      throw new Error("You must accept the terms and conditions");
    }
    return true;
  }),

  async (request, response, next) => {
    const errors = validationResult(request);
    const { firstName, lastName, email, password, terms } = request.body;

    if (!errors.isEmpty()) {
      return response.status(400).json({
        success: false,
        errors: errors.array().map((err) => ({
          field: err.path,
          message: err.msg,
        })),
      });
    }
    try {
      const hashedpassword = await bcrypt.hash(password, 12);

      const user = new User({
        firstName,
        lastName,
        email,
        password: hashedpassword,
      });

      await user.save();

      return response.status(201).json({
        userId: user._id,
        success: true,
        message: "User created successfully",
      });
    } catch (err) {
      if (err.code === 11000) {
        return response.status(409).json({
          success: false,
          errors: [
            {
              field: "email",
              message:
                "Email already registered. Please try using another email",
            },
          ],
        });
      }

      return response.status(500).json({
        success: false,
        errors: [
          {
            field: "unknown",
            message: "Error creating account. Please try again.",
          },
        ],
      });
    }
  },
];

exports.loginUser = async (request, response) => {
  //This function takes email and password from the frontend. Then with email first it tries to find the user from the database if not found then  error is sent to the frontend. If it is found then it matches the password with the stored password.Then it is check that the user found is a verified user or not if no then errro response is sent to the frontend.After that generate token function is called. After receiving the token it send the success message along with the token to the frontend.

  const { email, password } = request.body;
  try {
    const user = await User.findOne({ email });

    if (!user) {
      return response.status(404).json({
        success: false,
        errors: [
          {
            field: "email",
            message: "Invalid email or password",
          },
        ],
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return response.status(401).json({
        success: false,
        errors: [
          {
            field: "password",
            message: "Invalid email or password",
          },
        ],
      });
    }

    if (!user.isVerified) {
      return response.status(403).json({
        success: false,
        message: "Please verify your email before logging in",
      });
    }
    // Generate access token and refresh token
    const token = await generateTokens(user);

    return response.status(200).json({
      userId: user._id,
      success: true,
      token,
    });
  } catch (err) {
    return response.status(500).json({
      success: false,
      errors: [
        {
          field: "unknown",
          message: "Error occurred while logging in. Please try again.",
        },
      ],
    });
  }
};

exports.logoutUser = async (request, response) => {
  try {
    // This function takes user if from the frontend. Then the tokenfamily is deleted using the user id received.Then the reponse is sent to the frontend.

    const userId = request.user._id;

    
    await TokenFamily.deleteOne({ userId })

    return response.status(200).json({
      success: true,
      message: "Logged out successfully",
    })

  } catch (err) {
    return response.status(500).json({
      success: false,
      message: "Error logging out. Please try again.",
    })
  }
}