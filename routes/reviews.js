// =============================================
// REQUIRE
// =============================================
const express = require("express");
const { createReview, deleteReview } = require("../controllers/reviews");
const router = express.Router({ mergeParams: true });
const {
  validateReview,
  isLoggedIn,
  isAuthor,
} = require("../utils/middlewares");
// ==============================================
// ROUTES
// ==============================================

router.route("/reviews").post(isLoggedIn, validateReview, createReview);

router.route("/reviews/:reviewId").delete(isAuthor, isLoggedIn, deleteReview);

module.exports = router;
