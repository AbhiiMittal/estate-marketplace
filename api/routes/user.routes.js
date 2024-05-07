const express = require("express");
const { updateUser, deleteUser, getUserListings, getUser } = require("../controllers/user.controller.js");
const verifyToken = require("../utils/verifyToken.js");
const router = express.Router();
router.post("/update/:id", verifyToken, updateUser);
router.delete("/delete/:id", verifyToken, deleteUser);
router.get("/listings/:id",verifyToken,getUserListings);
router.get("/:id",verifyToken,getUser);
module.exports = router;