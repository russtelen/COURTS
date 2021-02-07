// =============================================
// REQUIRE
// =============================================
const {
  courtJoiSchema,
  photoSchema,
  reviewSchema,
} = require("../utils/joiSchemas");

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
