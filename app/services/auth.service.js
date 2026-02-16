// Imports
const usersModel = require("../api/models/users.model");
const verificationsModel = require("../api/models/verifications.model");
const { BadRequest, Conflict, NotFound } = require("../errors");
const { compareData, hashData } = require("../utils/bcrypt");
const generateOTP = require("../utils/generateOtp");
const { createToken } = require("../utils/jsonwebtoken");
const { sendEmail } = require("../utils/nodemailer");

// My-code
const authService = {
     // create user / register
     insert: async (req) => {
          // Request Body
          const { username, email, password, password_confirmation } = req.body;
          const dataUser = { username, email, password }

          // Validation
          if (!username || !email || !password || !password_confirmation) throw new BadRequest("ALL COLUMNS ARE REQUIRED TO BE FILLED IN");
          if (password !== password_confirmation) throw new BadRequest("PASSWORD CONFIRMATION DOESN'T MATCH");
          const userExist = await usersModel.findOne({ email });
          if (userExist) throw new Conflict("EMAIL ALREADY EXIST OR EMAIL HAS BEEN USED");

          // New User
          const newUser = await usersModel.create(dataUser);

          // Generate OTP 
          const OTP = generateOTP();
          await verificationsModel.create({
               user_email: email,
               purpose: "registration",
               otp_hash: OTP,
               expiresAt: new Date(Date.now() + (1000 * 60 * 5))
          })

          // Genarate Token
          const token = createToken({
               id: Date.now(),
               username: newUser.username,
               email: newUser.email
          })

          // Send OTP
          await sendEmail(email, OTP);

          return { data: newUser, token };
     },
     compare: async (req) => {
          // Request body
          const { email, password } = req.body;
          const user = await usersModel.findOne({ email });

          // Validation
          if (!email || !password) throw new BadRequest("ALL COLUMNS ARE REQUIRED TO BE FILLED IN");
          if (!user) throw new BadRequest("EMAIL DOESN'T EXIST OR IS NOTt REGISTERED");
          if (!await compareData(password, user.password)) throw new BadRequest("LOGIN FAILED");

          // Genarate Token
          const token = createToken({
               id: Date.now(),
               username: user.username,
               email: user.email
          })

          return { token }
     },
     verify: async (req) => {
          // Request body
          const { otp } = req.body;
          const verification = await verificationsModel.findOne({ email: req.user_email });

          // validation
          if (!otp) throw new BadRequest("ALL COLUMNS ARE REQUIRED TO BE FILLED IN");
          if (!verification) throw new NotFound("OTP NOT FOUND")
          if (verification.is_used) throw new BadRequest("OTP HAS BEEN USED");
          if (!await compareData(otp, verification.otp_hash)) throw new BadRequest("INVALID OTP")

          // Update user and verification model 
          await verificationsModel.findOneAndUpdate({ user_email: req.userEmail }, { is_used: true });
          await usersModel.findOneAndUpdate({ email: req.userEmail }, { is_Active: true });
     },
     sendOtp: async (req) => {
          // User
          const user = await usersModel.findOne({ email: req.userEmail });

          // Validation
          if (!user) throw new NotFound("USER NOT FOUND");

          // Generate OTP 
          const OTP = generateOTP();
          await verificationsModel.findOneAndDelete({ user_email: req.userEmail });
          await verificationsModel.create({
               user_email: req.userEmail,
               purpose: "registration",
               otp_hash: OTP,
               expiresAt: new Date(Date.now() + (1000 * 60 * 5))
          });

          // Send to user email
          await sendEmail(user.email, OTP);
     }
}

// Exports
module.exports = { authService }