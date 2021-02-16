// =============================================
// REQUIRE
// =============================================
const express = require("express");
const router = express.Router();
const { validateCourt, isLoggedIn, isAuthor } = require("../utils/middlewares");
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

router.get("/new", isLoggedIn, renderNewForm);

router
  .route("/:id")
  .get(showCourt)
  .put(isLoggedIn, isAuthor, validateCourt, editCourt)
  .delete(isAuthor, isLoggedIn, deleteCourt);

router.route("/:id/edit").get(isAuthor, isLoggedIn, renderEditForm);

module.exports = router;
