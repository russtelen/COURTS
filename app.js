// =============================================
// REQUIRE
// =============================================
const express = require("express");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const mongoose = require("mongoose");
const Court = require("./models/courts");
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

// =============================================
// ROUTES
// =============================================
// get
// home page
app.get("/", (req, res) => {
  res.render("home");
});

// get
// all courts
// render index.ejs
app.get("/courts", async (req, res) => {
  const courts = await Court.find({});

  res.render("courts/index", { courts });
});

// get
// form to add new court
// render new.ejs
app.get("/courts/new", async (req, res) => {
  res.render("courts/new");
});

// get
// one court
// render show.ejs
app.get("/courts/:id", async (req, res) => {
  const { id } = req.params;
  const court = await Court.findById(id);

  res.render("courts/show", { court });
});

// get
// form to add new court
// render new.ejs
app.get("/courts/:id/edit", async (req, res) => {
  const { id } = req.params;
  const court = await Court.findOne({ _id: id });
  res.render("courts/edit", { court });
});

// post
// new court
app.post("/courts", async (req, res) => {
  const court = new Court(req.body);
  await court.save();
  res.redirect("/courts");
});

// put
// update court selected by id
app.put("/courts/:id", async (req, res) => {
  const { id } = req.params;
  await Court.findOneAndUpdate({ _id: id }, req.body);
  res.redirect(`/courts/${id}`);
});

//==============================================
// LISTEN
// =============================================
let port = process.env.port;

if (port == null || port == "") {
  port = 5000;
}

app.listen(port, () => {
  console.log(`Connected to Port ${port}! http://localhost:${port}/`);
});
