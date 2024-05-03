const express = require("express");
const { updateUser, deleteUser } = require("../controllers/user.controller.js");
const verifyToken = require("../utils/verifyToken.js");
const router = express.Router();
router.post("/update/:id", verifyToken, updateUser);
router.delete("/delete/:id", verifyToken, deleteUser);

module.exports = router;