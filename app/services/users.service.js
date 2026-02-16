// Imports
const usersModel = require("../api/models/users.model");
const { BadRequest, Conflict, NotFound } = require("../errors");

// My-code
const userService = {
     insert: async (req) => {
          // Request body
          const { username, email, password, password_confirmation, is_Active, role, } = req.body;

          // Validation
          if (!username || !email || !password || !password_confirmation || !is_Active || !role) throw new BadRequest("ALL COLUMNS ARE REQUIRED TO BE FILLED IN");
          if (password !== password_confirmation) throw new BadRequest("PASSWORD CONFIRMATION DOESN'T MATCH");
          if (await usersModel.findOne({ email })) throw new Conflict("EMAIL ALREADY EXIST OR EMAIL HAS BEEN USED");

          // DATA NEW USER
          const userData = { username, email, password, password_confirmation, is_Active, role };
          const newUser = await usersModel.create(userData);

          // RESULT
          return newUser
     },
     update: async (req) => {
          // Request Body and Params
          const { id } = req.params;
          const { username, email, is_Active, role } = req.body;

          // Update user
          const userUpdate = await usersModel.findOneAndUpdate({ _id: id }, { username, email, is_Active, role }, { new: true, runValidators: true });
          return userUpdate;
     },
     delete: async (req) => {
          // Request Body
          const { id } = req.params;
          const user = await usersModel.findByIdAndDelete(id);

          // Validation
          if (!user) throw new NotFound("USER NOT FOUND");

          return;
     }
}

// Exports
module.exports = userService