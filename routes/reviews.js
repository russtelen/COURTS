// =============================================
// REQUIRE
// =============================================
const express = require("express");
const { createReview, deleteReview } = require("../controllers/reviews");
const router = express.Router({ mergeParams: true });
const {
  validateReview,
  isLoggedIn,
  isReviewAuthor,
} = require("../utils/middlewares");
// ==============================================
// ROUTES
// ==============================================

router.route("/reviews").post(isLoggedIn, validateReview, createReview);

router
  .route("/reviews/:reviewId")
  .delete(isLoggedIn, isReviewAuthor, deleteReview);

module.exports = router;
