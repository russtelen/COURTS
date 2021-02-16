const Court = require("../models/courts");
const Review = require("../models/reviews");
const catchAsync = require("../utils/catchAsync.js");

module.exports.createReview = catchAsync(async (req, res) => {
  // get court id from params
  const { id } = req.params;
  const { body, rating } = req.body;
  // find court by :id
  const court = await Court.findById(id);
  // create new review based off req.body
  const review = new Review({ body, rating, author: req.user._id });
  //push review in court.reviews array (model)
  court.reviews.push(review);
  //save both review and court
  await court.save();
  await review.save();
  req.flash("success", "Successfully addded review");
  res.redirect(`/courts/${id}`);
});

module.exports.deleteReview = catchAsync(async (req, res) => {
  const { id, reviewId } = req.params;
  const court = await Court.findByIdAndUpdate(id, {
    $pull: { reviews: reviewId },
  });
  await Review.findByIdAndDelete(reviewId);
  req.flash("success", "Successfully deleted review");
  res.redirect(`/courts/${court._id}`);
});
