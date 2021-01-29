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
const catchAsync = require("./utils/catchAsync.js");
const ExpressError = require("./utils/ExpressError.js");
const { courtJoiSchema, reviewSchema } = require("./utils/joiSchemas");
const dotenv = require("dotenv");
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
const validateCourt = (req, res, next) => {
  const { error } = courtJoiSchema.validate(req.body);

  if (error) {
    const msg = error.details.map((e) => e.message).join(",");
    throw new ExpressError(msg, 400);
  } else {
    next();
  }
};

const validateReview = (req, res, next) => {
  const { error } = reviewSchema.validate(req.body);

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
// COURTS ROUTES
//-----------------------
// get
// home page
app.get("/", (req, res) => {
  res.render("home");
});

// get
// all courts
// render index.ejs
app.get(
  "/courts",
  catchAsync(async (req, res) => {
    const courts = await Court.find({});

    res.render("courts/index", { courts });
  })
);

// get
// form to add new court
// render new.ejs
app.get(
  "/courts/new",
  catchAsync(async (req, res) => {
    res.render("courts/new");
  })
);

// get
// one court
// render show.ejs
app.get(
  "/courts/:id",
  catchAsync(async (req, res) => {
    const { id } = req.params;
    const court = await Court.findById(id).populate("reviews");

    const getAverageRating = () => {
      // get average rating of court
      var total = 0;
      const ratingArray = court.reviews.map((review) => {
        return review.rating;
      });
      ratingArray.forEach((rating) => {
        total += rating;
      });
      var averageRating = total / ratingArray.length;

      return averageRating;
    };

    res.render("courts/show", { court, getAverageRating });
  })
);

// get
// form to add new court
// render new.ejs
app.get(
  "/courts/:id/edit",
  catchAsync(async (req, res) => {
    const { id } = req.params;
    const court = await Court.findOne({ _id: id });
    res.render("courts/edit", { court });
  })
);

// post
// new court
app.post(
  "/courts",
  validateCourt,
  catchAsync(async (req, res) => {
    const court = new Court(req.body);
    await court.save();
    res.redirect("/courts");
  })
);

// put
// update court selected by id
app.put(
  "/courts/:id",
  validateCourt,
  catchAsync(async (req, res) => {
    const { id } = req.params;
    await Court.findOneAndUpdate({ _id: id }, req.body, {
      useFindAndModify: false,
    });
    res.redirect(`/courts/${id}`);
  })
);

// delete
// delete court selected by id
app.delete(
  "/courts/:id",
  catchAsync(async (req, res) => {
    const { id } = req.params;
    await Court.findByIdAndDelete(id);
    res.redirect("/courts");
  })
);

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
