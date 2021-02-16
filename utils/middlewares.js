// =============================================
// REQUIRE
// =============================================
const express = require("express");
const app = express();
const {
  courtJoiSchema,
  photoSchema,
  reviewSchema,
} = require("../utils/joiSchemas");
const Court = require("../models/courts");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("../models/users");
// Passport/Auth
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
// ==============================================
// CUSTOM MIDDLEWARES
// ==============================================

// Server Side Validations
//--------------------------------------------------
module.exports.validateCourt = (req, res, next) => {
  const { error } = courtJoiSchema.validate(req.body);

  if (error) {
    const msg = error.details.map((e) => e.message).join(",");
    throw new ExpressError(msg, 400);
  } else {
    next();
  }
};

module.exports.validatePhoto = (req, res, next) => {
  const { error } = photoSchema.validate(req.body);

  if (error) {
    const msg = error.details.map((e) => e.message).join(",");
    throw new ExpressError(msg, 400);
  } else {
    next();
  }
};

module.exports.validateReview = (req, res, next) => {
  const { error } = reviewSchema.validate(req.body);

  if (error) {
    const msg = error.details.map((e) => e.message).join(",");
    throw new ExpressError(msg, 400);
  } else {
    next();
  }
};

// Middleware to check if there is a user logged in
module.exports.isLoggedIn = (req, res, next) => {
  if (!req.isAuthenticated()) {
    // store url they are requesting to session
    // returnTo -> made up (can be anything
    // originalUrl -> from express
    req.session.returnTo = req.originalUrl;

    req.flash("error", "You must be logged in to do that !");
    return res.redirect("/login");
  }
  next();
};

// Middleware to check if the user is the author of that post
module.exports.isCourtAuthor = async (req, res, next) => {
  const { id } = req.params;
  const court = await Court.findById(id);
  if (!court.author.equals(req.user._id)) {
    req.flash("error", "You do not have permission to do that");
    return res.redirect(`/courts/${court._id}`);
  }
  next();
};
