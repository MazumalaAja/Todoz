// Imports

const userService = require("../../services/users.service");

// My-code
async function insert(req, res, next) {
     try {
          const response = await userService.insert(req);
          res.status(201).json({
               status: "CREATED",
               code: "201",
               data: response,
               message: "SUCCESS TO CREATE A NEW USER"
          })
     } catch (err) {
          return next(err);
     }
}

async function update(req, res, next) {
     try {
          const response = await userService.update(req);
          res.status(200).json({
               status: "OK",
               data: response,
               message: "SUCCESS TO UPDATE USER"
          })
     } catch (err) {
          return next(err);
     }
}

async function deleteUser(req, res, next) {
     try {
          const response = await userService.delete(req);
          res.status(200).json({
               status: "OK",
               code: "200",
               message: "SUCCESS TO DELETE USER"
          });
     } catch (err) {
          next(err);
     }
}

// Exports
module.exports = { insert, update, deleteUser }