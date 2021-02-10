//==========================================
// REQUIRE
//==========================================
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

//==========================================
// SET UP SCHEMA
//==========================================
const reviewSchema = new Schema({
  body: {
    type: String,
    required: true,
  },
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5,
  },
  author: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
});

//==========================================
// SET UP MODEL
//==========================================
const Review = mongoose.model("Review", reviewSchema);

// EXPORT
module.exports = Review;
