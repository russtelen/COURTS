// =============================================
// REQUIRE
// =============================================
const express = require("express");
const { index, addPhoto, deletePhoto } = require("../controllers/photos");
const router = express.Router({ mergeParams: true });
const {
  validatePhoto,
  isLoggedIn,
  isPhotoAuthor,
} = require("../utils/middlewares");

// ==============================================
// ROUTES
// ==============================================

router
  .route("/photos")
  .get(isLoggedIn, index)
  .post(isLoggedIn, validatePhoto, addPhoto);

router.route("/photos/:photoId").delete(isLoggedIn, isPhotoAuthor, deletePhoto);

module.exports = router;
