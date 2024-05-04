const express = require("express");
const router = express.Router();
const createListing = require("../controllers/listing.controller.js");
const verifyToken = require("../utils/verifyToken.js");

router.post('/create',verifyToken,createListing);

module.exports = router;