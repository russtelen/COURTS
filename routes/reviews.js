// =============================================
// REQUIRE
// =============================================
const express = require("express");
const router = express.Router({ mergeParams: true });
const Court = require("../models/courts");
const Review = require("../models/reviews");
const catchAsync = require("../utils/catchAsync.js");
const { validateReview, isLoggedIn } = require("../utils/middlewares");
// ==============================================
// ROUTES
// ==============================================
// post
// one review associated to a court
router.post(
  "/reviews",
  isLoggedIn,
  validateReview,
  catchAsync(async (req, res) => {
    // get court id from params
    const { id } = req.params;
    // find court by :id
    const court = await Court.findById(id);
    // create new review based off req.body
    const review = new Review(req.body);
    //push review in court.reviews array (model)
    court.reviews.push(review);
    //save both review and court
    await court.save();
    await review.save();
    req.flash("success", "Successfully addded review");
    res.redirect(`/courts/${id}`);
  })
);

//delete
//one review associated to a court
router.delete(
  "/reviews/:reviewId",
  isLoggedIn,
  catchAsync(async (req, res) => {
    const { id, reviewId } = req.params;
    const court = await Court.findByIdAndUpdate(id, {
      $pull: { reviews: reviewId },
    });
    await Review.findByIdAndDelete(reviewId);
    req.flash("success", "Successfully deleted review");
    res.redirect(`/courts/${court._id}`);
  })
);

module.exports = router;
