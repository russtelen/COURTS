// =============================================
// REQUIRE
// =============================================
const express = require("express");
const router = express.Router();
const {
  validateCourt,
  isLoggedIn,
  isCourtAuthor,
} = require("../utils/middlewares");
const {
  index,
  renderNewForm,
  showCourt,
  renderEditForm,
  createCourt,
  editCourt,
  deleteCourt,
} = require("../controllers/courts");

// ==============================================
// ROUTES
// ==============================================

router.route("/").get(index).post(isLoggedIn, validateCourt, createCourt);

router.route("/new").get(isLoggedIn, renderNewForm);

router
  .route("/:id")
  .get(showCourt)
  .put(isLoggedIn, isCourtAuthor, validateCourt, editCourt)
  .delete(isCourtAuthor, isLoggedIn, deleteCourt);

router.route("/:id/edit").get(isCourtAuthor, isLoggedIn, renderEditForm);

module.exports = router;
