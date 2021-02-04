// =============================================
// REQUIRE
// =============================================
const express = require("express");
const router = express.Router({ mergeParams: true });
const Court = require("../models/courts");
const Photo = require("../models/photos");
const catchAsync = require("../utils/catchAsync.js");
const { photoSchema } = require("../utils/joiSchemas");

// ==============================================
// CUSTOM MIDDLEWARES
// ==============================================
const validatePhoto = (req, res, next) => {
  const { error } = photoSchema.validate(req.body);

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
// all photos
router.get(
  "/photos",
  catchAsync(async (req, res) => {
    const { id } = req.params;
    const court = await Court.findById(id).populate("photos");
    var photos = court.photos;
    if (!court) {
      req.flash("error", "Cannot find that court");
      return res.redirect("/courts");
    }
    res.render("photos/index", { photos, court });
  })
);

// post
// one photo associated to a court
router.post(
  "/photos",
  validatePhoto,
  catchAsync(async (req, res) => {
    const { id } = req.params;
    const court = await Court.findById(id);
    const photo = new Photo(req.body);
    court.photos.push(photo);
    await court.save();
    await photo.save();
    req.flash("success", "Successfully added new photo");
    res.redirect(`/courts/${id}`);
  })
);

//delete
//one photo associated to a court
router.delete(
  "/photos/:photoId",
  catchAsync(async (req, res) => {
    const { id, photoId } = req.params;
    const court = await Court.findByIdAndUpdate(id, {
      $pull: { photos: photoId },
    });
    await Photo.findByIdAndDelete(photoId);
    req.flash("success", "Successfully deleted photo");
    res.redirect(`/courts/${court._id}`);
  })
);

module.exports = router;
