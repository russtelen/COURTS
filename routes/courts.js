// =============================================
// REQUIRE
// =============================================
const express = require("express");
const router = express.Router();
const Court = require("../models/courts");
const catchAsync = require("../utils/catchAsync.js");
const { courtJoiSchema } = require("../utils/joiSchemas");

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

// ==============================================
// ROUTES
// ==============================================

// get
// all courts
// render index.ejs
router.get(
  "/",
  catchAsync(async (req, res) => {
    const courts = await Court.find({});

    res.render("courts/index", { courts });
  })
);

// get
// form to add new court
// render new.ejs
router.get(
  "/new",
  catchAsync(async (req, res) => {
    res.render("courts/new");
  })
);

// get
// one court
// render show.ejs
router.get(
  "/:id",
  catchAsync(async (req, res) => {
    const { id } = req.params;
    const court = await Court.findById(id)
      .populate("reviews")
      .populate("photos");

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
router.get(
  "/:id/edit",
  catchAsync(async (req, res) => {
    const { id } = req.params;
    const court = await Court.findOne({ _id: id });
    res.render("courts/edit", { court });
  })
);

// post
// new court
router.post(
  "/",
  validateCourt,
  catchAsync(async (req, res) => {
    const court = new Court(req.body);
    await court.save();
    res.redirect("/courts");
  })
);

// put
// update court selected by id
router.put(
  "/:id",
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
router.delete(
  "/:id",
  catchAsync(async (req, res) => {
    const { id } = req.params;
    await Court.findByIdAndDelete(id);
    res.redirect("/courts");
  })
);

module.exports = router;
