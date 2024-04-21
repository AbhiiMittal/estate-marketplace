const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
const authRoutes = require("./routes/auth.routes.js");
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
app.use(express.json());
app.use(cors());





app.use("/users",userRoutes);
app.use("/auth",authRoutes);

app.use((err,req,res,next)=>{
  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal Server Error";

  res.json({
    success : false,
    message : message,
    statusCode : statusCode
  })
})
app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
