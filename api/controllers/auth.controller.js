const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const userModel = require("../models/userModel.js");
const {errorHandler} = require("../utils/error.js");


const signup = async (req, res,next) => {
  try {
    const { username, email, password } = req.body;
    const userCred = await userModel.findOne({ email: email });
    if (userCred) {
      next(errorHandler("User already exists",404));
      return;
    }
    if(await userModel.findOne({name:username})){
      next(errorHandler("Username already exists",404));
      return;
    }
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

const signin = async (req, res,next) => {
  try {
    const {email, password } = req.body;
    const validCred = await userModel.findOne({ email: email });
    // console.log(validCred)
    if (validCred===null) {
      next(errorHandler("Invalid email",404));
    }
    const validPassword = await bcrypt.compare(password, validCred.password);
    if (!validPassword) {
      next(errorHandler("Invalid password",404));
      return;
    }
    const token = jwt.sign({ id: validCred._id},process.env.KEY,{expiresIn: "1h"});
    res.cookie("token",token, {
      httpOnly: true,
    }).status(200).json({ message: "User logged in successfully" });
  } catch (err) {
    next(errorHandler(err.message, 550));
  }
};


module.exports = { signup,signin };
