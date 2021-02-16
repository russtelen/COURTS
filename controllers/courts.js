const Court = require("../models/courts");
const catchAsync = require("../utils/catchAsync");

module.exports.index = catchAsync(async (req, res) => {
  const courts = await Court.find({});

  res.render("courts/index", { courts });
});

module.exports.renderNewForm = catchAsync(async (req, res) => {
  res.render("courts/new");
});

module.exports.showCourt = catchAsync(async (req, res) => {
  const { id } = req.params;
  const court = await Court.findById(id)
    .populate({
      path: "reviews",
      populate: {
        path: "author",
      },
    })
    .populate({
      path: "photos",
      populate: {
        path: "author",
      },
    })
    .populate("author");
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
});

module.exports.renderEditForm = catchAsync(async (req, res) => {
  const { id } = req.params;
  const court = await Court.findOne({ _id: id });
  if (!court) {
    req.flash("error", "Cannot find that court");
    return res.redirect("/courts");
  }
  res.render("courts/edit", { court });
});

module.exports.createCourt = catchAsync(async (req, res) => {
  const court = new Court(req.body);
  await court.save();
  req.flash("success", "Successfully made a new court");
  res.redirect("/courts");
});

module.exports.editCourt = catchAsync(async (req, res) => {
  const { id } = req.params;
  await Court.findByIdAndUpdate(id, req.body, {
    useFindAndModify: false,
  });
  req.flash("success", "Successfully updated court");
  res.redirect(`/courts/${id}`);
});

module.exports.deleteCourt = catchAsync(async (req, res) => {
  const { id } = req.params;
  await Court.findByIdAndDelete(id);
  req.flash("success", "Successfully deleted court");
  res.redirect("/courts");
});
