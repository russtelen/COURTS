//==========================================
// REQUIRE
//==========================================
const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Review = require("./reviews.js");

//==========================================
// SET UP SCHEMA
//==========================================
const courtSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  location: {
    type: String,
    required: true,
  },
  opening_hours: {
    type: String,
    required: true,
    min: 0,
    max: 12,
  },
  closing_hours: {
    type: String,
    required: true,
    min: 0,
    max: 12,
  },
  court: {
    type: String,
    required: true,
    enum: ["indoor", "outdoor"],
  },
  avgNumberOfPlayers: {
    type: Number,
    required: true,
    min: 0,
  },
  reviews: [
    {
      type: Schema.Types.ObjectId,
      ref: "Review",
    },
  ],
});

// Mongoose middleware to delete reviews when campground is deleted
courtSchema.post("findOneAndDelete", async function (court) {
  if (court) {
    await Review.deleteMany({ _id: { $in: court.reviews } });
  }
});

//==========================================
// SET UP MODEL
//==========================================
const Court = mongoose.model("Court", courtSchema);

// EXPORT
module.exports = Court;
