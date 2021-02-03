// =============================================
// REQUIRE
// =============================================
const express = require("express");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const mongoose = require("mongoose");
const Court = require("./models/courts");
const Review = require("./models/reviews");
const Photo = require("./models/photos");
const catchAsync = require("./utils/catchAsync.js");
const ExpressError = require("./utils/ExpressError.js");
const { reviewSchema, photoSchema } = require("./utils/joiSchemas");
const dotenv = require("dotenv");
// REQUIRE-ROUTES
//---------------
const courts = require("./routes/courts");
// ==============================================
// CONFIG
// =============================================
// init express
const app = express();

// Serving static assets
app.use(express.static(path.join(__dirname, "/public")));

// Parsing Middlewares
app.use(express.urlencoded({ extended: true })); // application/x-www-form-urlencoded
app.use(express.json()); // JSON

// EJS Mate -> for layouts
app.engine("ejs", ejsMate);

// Setting up the views directory
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "/views"));

// Override with POST having ?_method=PATCH or DELETE
app.use(methodOverride("_method"));

// Read .env file
dotenv.config();

// Connect Mongoose
let localDb = "mongodb://localhost:27017/courts";
let atlasDb = process.env.db;
mongoose
  .connect(localDb, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("MONGO CONNECTED!");
  })
  .catch((e) => {
    console.log("MONGO CONNECTION ERROR :(");
    console.log(e);
  });

// ==============================================
// CUSTOM MIDDLEWARES
// ==============================================
const validateReview = (req, res, next) => {
  const { error } = reviewSchema.validate(req.body);

  if (error) {
    const msg = error.details.map((e) => e.message).join(",");
    throw new ExpressError(msg, 400);
  } else {
    next();
  }
};

const validatePhoto = (req, res, next) => {
  const { error } = photoSchema.validate(req.body);

  if (error) {
    const msg = error.details.map((e) => e.message).join(",");
    throw new ExpressError(msg, 400);
  } else {
    next();
  }
};

// =============================================
// ROUTES
// =============================================
// get
// home page
app.get("/", (req, res) => {
  res.render("home");
});

// COURTS ROUTES
//-----------------------
app.use("/courts", courts);

// REVIEW ROUTES
//-----------------------
// post
// one review associated to a court
app.post(
  "/courts/:id/reviews",
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
    res.redirect(`/courts/${id}`);
  })
);

//delete
//one review associated to a court
app.delete(
  "/courts/:courtId/reviews/:reviewId",
  catchAsync(async (req, res) => {
    const { courtId, reviewId } = req.params;
    const court = await Court.findByIdAndUpdate(courtId, {
      $pull: { reviews: reviewId },
    });
    await Review.findByIdAndDelete(reviewId);
    res.redirect(`/courts/${court._id}`);
  })
);

// PHOTO ROUTES
//-----------------------
// get
// all photos
app.get(
  "/courts/:id/photos",
  catchAsync(async (req, res) => {
    const { id } = req.params;
    const court = await Court.findById(id).populate("photos");
    var photos = court.photos;

    res.render("photos/index", { photos, court });
  })
);

// post
// one photo associated to a court
app.post(
  "/courts/:id/photos",
  validatePhoto,
  catchAsync(async (req, res) => {
    const { id } = req.params;
    const court = await Court.findById(id);
    const photo = new Photo(req.body);
    court.photos.push(photo);
    await court.save();
    await photo.save();
    res.redirect(`/courts/${id}`);
  })
);

//delete
//one photo associated to a court
app.delete(
  "/courts/:courtId/photos/:photoId",
  catchAsync(async (req, res) => {
    const { courtId, photoId } = req.params;
    const court = await Court.findByIdAndUpdate(courtId, {
      $pull: { photos: photoId },
    });
    await Photo.findByIdAndDelete(photoId);
    res.redirect(`/courts/${court._id}`);
  })
);

// ==============================================
// ERROR HANDLERS
// =============================================
app.all("*", (req, res, next) => {
  next(new ExpressError("Page not found", 404));
});

app.use((err, req, res, next) => {
  const { statusCode = 500 } = err;
  if (!err.message) {
    err.message = "Oh no, Something went wrong";
  }
  res.status(statusCode).render("error", { err });
});

//==============================================
// LISTEN
// =============================================
let port = process.env.PORT;

if (port == null || port == "") {
  port = 5000;
}

app.listen(port, () => {
  console.log(`Connected to Port ${port}! http://localhost:${port}/`);
});
