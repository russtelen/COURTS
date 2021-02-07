// =============================================
// REQUIRE
// =============================================
const express = require("express");
const router = express.Router();
const Court = require("../models/courts");
const catchAsync = require("../utils/catchAsync.js");
const { validateCourt, isLoggedIn } = require("../utils/middlewares");

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
  isLoggedIn,
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

    if (!court) {
      req.flash("error", "Cannot find that court");
      return res.redirect("/courts");
    }

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
  isLoggedIn,
  catchAsync(async (req, res) => {
    const { id } = req.params;
    const court = await Court.findOne({ _id: id });
    if (!court) {
      req.flash("error", "Cannot find that court");
      return res.redirect("/courts");
    }
    res.render("courts/edit", { court });
  })
);

// post
// new court
router.post(
  "/",
  isLoggedIn,
  validateCourt,
  catchAsync(async (req, res) => {
    const court = new Court(req.body);
    await court.save();
    req.flash("success", "Successfully made a new court");
    res.redirect("/courts");
  })
);

// put
// update court selected by id
router.put(
  "/:id",
  isLoggedIn,
  validateCourt,
  catchAsync(async (req, res) => {
    const { id } = req.params;
    await Court.findByIdAndUpdate(id, req.body, {
      useFindAndModify: false,
    });
    req.flash("success", "Successfully updated court");
    res.redirect(`/courts/${id}`);
  })
);

// delete
// delete court selected by id
router.delete(
  "/:id",
  isLoggedIn,
  catchAsync(async (req, res) => {
    const { id } = req.params;
    await Court.findByIdAndDelete(id);
    req.flash("success", "Successfully deleted court");
    res.redirect("/courts");
  })
);

module.exports = router;
