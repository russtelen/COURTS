// =============================================
// REQUIRE
// =============================================
const express = require("express");
const router = express.Router();
const catchAsync = require("../utils/catchAsync.js");

// ==============================================
// ROUTES
// ==============================================

// get
// form to login
router.get("/login", (req, res) => {
  res.render("users/login");
});

// get
// form to register
router.get("/register", (req, res) => {
  res.render("users/register");
});

module.exports = router;
