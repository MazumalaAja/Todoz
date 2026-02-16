const { NotFound } = require("../errors");
const { Unauthorized } = require("../errors/unauthorized");
const { verifyToken } = require("../utils/jsonwebtoken");

// My-code
async function authMiddleware(req, res, next) {
     try {
          // Request Headers
          const { authorization } = req.headers;

          // Validation
          if (!authorization) throw new Unauthorized("INVALID AUTHORIZATION");

          // Data Users
          const token = authorization.split(" ")[1];
          const userData = await verifyToken(token);

          // Validation
          if (!userData) throw new NotFound("USER NOT FOUND")

          // Result
          req.userEmail = userData.email;
          next();
     } catch (err) {
          next(err);
     }
}

// Exports
module.exports = authMiddleware;