// =============================================
// REQUIRE
// =============================================
const express = require("express");
const passport = require("passport");
const router = express.Router();
const catchAsync = require("../utils/catchAsync.js");
const User = require("../models/users");

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

// post
// create a new user (register)
router.post(
  "/register",
  catchAsync(async (req, res) => {
    try {
      const { username, email, password } = req.body;
      const user = await new User({ username, email });
      const registeredUser = await User.register(user, password);
      req.login(registeredUser, (err) => {
        if (err) return next(err);
        req.flash("success", "Welcome to Courts");
        res.redirect("/courts");
      });
    } catch (e) {
      req.flash("error", e.message);
      res.redirect("/register");
    }
  })
);

// post
// login user
router.post(
  "/login",
  passport.authenticate("local", {
    failureFlash: true,
    failureRedirect: "/login",
  }),
  (req, res) => {
    req.flash("success", "Welcome back!");
    const redirectUrl = req.session.returnTo || "/courts";
    delete req.session.returnTo; // delete returnTo from session
    res.redirect(redirectUrl);
  }
);

// logout
router.get("/logout", (req, res) => {
  req.logout();
  req.flash("success", "Succesfully logged out");
  res.redirect("/");
});

module.exports = router;
