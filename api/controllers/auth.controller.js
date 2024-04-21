const bcrypt = require("bcryptjs");
const userModel = require("../models/userModel.js");
const {errorHandler} = require("../utils/error.js");


const signup = async (req, res,next) => {
  try {
    const { username, email, password } = req.body;
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const user = new userModel({
        name: username,
        email : email,
        password: hashedPassword
      });
      
    await user.save();
    res.json({ message: "User created successfully" });
  } catch (err) {
    next(errorHandler(err.message, 550));
  }
};

module.exports = { signup };
