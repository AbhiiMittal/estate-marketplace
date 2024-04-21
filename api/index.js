const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");

const userRoutes = require("./routes/user.routes.js");
dotenv.config();


mongoose.connect(process.env.MONGO).
then(() => {
  console.log("Connected to MongoDB");
}).
catch((err) => {
  console.log("Error connecting to MongoDB", err);
});

const app = express();

app.use("/users",userRoutes);

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
