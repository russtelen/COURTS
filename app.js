// =============================================
// REQUIRE
// =============================================
const express = require("express");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const mongoose = require("mongoose");
const ExpressError = require("./utils/ExpressError.js");
const dotenv = require("dotenv");
const session = require("express-session");
const flash = require("connect-flash");
// REQUIRE-AUTH
//---------------
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/users");
// REQUIRE-ROUTES
//---------------
const courts = require("./routes/courts");
const reviews = require("./routes/reviews");
const photos = require("./routes/photos");
const users = require("./routes/users");

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

// Express Session
const sessionConfig = {
  secret: "secretCode",
  resave: false,
  saveUninitialized: false,
  cookie: {
    httpOnly: true,
    expires: Date.now() + 1000 * 60 * 60 * 24 * 7, // expires in 1 week
    maxAge: 1000 * 60 * 60 * 24 * 7,
  },
};
app.use(session(sessionConfig));

// Connect flash
app.use(flash());

// Passport/Auth
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// Read .env file
dotenv.config();

// Connect Mongoose
let localDb = process.env.localDb;
let atlasDb = process.env.db;
mongoose
  .connect(atlasDb, {
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
// CUSTOM MIDDLEWARE
// ==============================================
// middleware for global variables (global states)
app.use((req, res, next) => {
  res.locals.currentUser = req.user;
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  next();
});

// =============================================
// ROUTES
// =============================================
// get
// home page
app.get("/", (req, res) => {
  res.render("home");
});

// COURTS ROUTES
//-----------------------
app.use("/courts", courts);

// REVIEW ROUTES
//-----------------------
app.use("/courts/:id", reviews);

// PHOTO ROUTES
//-----------------------
app.use("/courts/:id", photos);

// USER ROUTES
//-----------------------
app.use("/", users);

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
