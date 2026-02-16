// Imports
const { authService } = require("../../services/auth.service");

// My-code
async function register(req, res, next) {
     try {
          const response = await authService.insert(req);
          res.status(201).json({
               status: "CREATED",
               code: "201",
               message: "SUCCESS TO CREATE A NEW USER",
               token: response.token,
               data: response.data
          })
     } catch (err) {
          return next(err);
     }
}

async function login(req, res, next) {
     try {
          const response = await authService.compare(req);
          res.status(200).json({
               status: "OK",
               code: "200",
               message: "LOGIN SUCCESSFULY",
               token: response.token
          })
     } catch (err) {
          return next(err);
     }
}

async function verify(req, res, next) {
     try {
          const response = await authService.verify(req);
          res.status(200).json({
               status: "OK",
               code: "200",
               message: "VERIFICATION SUCCESSFULY"
          })
     } catch (err) {
          return next(err);
     }
}

async function send(req, res, next) {
     try {
          const response = await authService.sendOtp(req);
          res.status(200).json({
               status: "OK",
               code: "200",
               message: "OTP HAS BEEN SENT TO EMAIL"
          })
     } catch (err) {
          return next(err);
     }
}

// Exports
module.exports = { register, login, verify, send }