const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const userModel = require("../models/UserModel.js");
const { errorHandler } = require("../utils/error.js");

const signup = async (req, res, next) => {
  try {
    const { username, email, password } = req.body;
    const userCred = await userModel.findOne({ email: email });
    if (userCred) {
      next(errorHandler("User already exists", 404));
      return;
    }
    if (await userModel.findOne({ username: username })) {
      next(errorHandler("Username already exists", 404));
      return;
    }
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const user = new userModel({
      username: username,
      email: email,
      password: hashedPassword,
    });

    await user.save();
    res.json({ message: "User created successfully" });
  } catch (err) {
    next(errorHandler(err.message, 550));
  }
};

const signin = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const validCred = await userModel.findOne({ email: email });
    console.log(validCred)
    if (validCred === null) {
      next(errorHandler("Invalid email", 404));
    }
    const validPassword = await bcrypt.compare(password, validCred.password);
    if (!validPassword) {
      next(errorHandler("Invalid password", 404));
      return;
    }
    const token = jwt.sign({ id: validCred._id }, process.env.KEY);
    // console.log(token);
    res.json({validCred,token,success : true});
  } catch (err) {
    next(errorHandler(err.message, 550));
  }
};

const google = async (req, res,next) => {
  try {
    const user = await userModel.findOne({ email: req.body.email });
    // console.log(user);
    // console.log(req.body.name);
    if (!user) {
      const generatePassword = Math.random().toString(36).slice(-8);
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(generatePassword, salt);
      const newUser = new userModel({
        username:
          req.body.name.split(" ").join("") + Math.floor(Math.random() * 1000),
        email: req.body.email,
        password: hashedPassword,
        avatar: req.body.photo,
      });
      await newUser.save();
      const token = jwt.sign({ id: newUser._id }, process.env.KEY, {
        expiresIn: "1h",
      });
      res.status(200).json(newUser);
    }
    const token = jwt.sign({ id: user._id }, process.env.KEY, {
      expiresIn: "1h",
    });
    res.status(200).json(user);
  } catch (error) {
    console.log(error.message);
    next(error);
  }
};

module.exports = { signup, signin, google };