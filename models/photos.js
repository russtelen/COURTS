//==========================================
// REQUIRE
//==========================================
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

//==========================================
// SET UP SCHEMA
//==========================================
const photoSchema = new Schema({
  image: {
    type: String,
    required: true,
  },
  author: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
});

//==========================================
// SET UP MODEL
//==========================================
const Photo = mongoose.model("Photo", photoSchema);

// EXPORT
module.exports = Photo;
