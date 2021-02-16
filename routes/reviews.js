// =============================================
// REQUIRE
// =============================================
const express = require("express");
const { createReview, deleteReview } = require("../controllers/reviews");
const router = express.Router({ mergeParams: true });
const { validateReview, isLoggedIn } = require("../utils/middlewares");
// ==============================================
// ROUTES
// ==============================================

router.route("/reviews").post(isLoggedIn, validateReview, createReview);

router.route("/reviews/:reviewId").delete(isLoggedIn, deleteReview);

module.exports = router;
