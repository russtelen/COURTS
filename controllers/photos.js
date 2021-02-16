const Court = require("../models/courts");
const Photo = require("../models/photos");
const catchAsync = require("../utils/catchAsync.js");

module.exports.index = catchAsync(async (req, res) => {
  const { id } = req.params;
  const court = await Court.findById(id).populate({
    path: "photos",
    populate: {
      path: "author",
    },
  });
  var photos = court.photos;
  if (!court) {
    req.flash("error", "Cannot find that court");
    return res.redirect("/courts");
  }
  res.render("photos/index", { photos, court });
});

module.exports.addPhoto = catchAsync(async (req, res) => {
  const { id } = req.params;
  const { image } = req.body;
  const court = await Court.findById(id);
  const photo = new Photo({ image, author: req.user._id });
  court.photos.push(photo);
  await court.save();
  await photo.save();
  req.flash("success", "Successfully added new photo");
  res.redirect(`/courts/${id}`);
});

module.exports.deletePhoto = catchAsync(async (req, res) => {
  const { id, photoId } = req.params;
  const court = await Court.findByIdAndUpdate(id, {
    $pull: { photos: photoId },
  });
  await Photo.findByIdAndDelete(photoId);
  req.flash("success", "Successfully deleted photo");
  res.redirect(`/courts/${court._id}`);
});
