const express = require("express");
const engine = require("ejs-mate");
const path = require("path");
const mongoose = require("mongoose");
const methodOverride = require("method-override");
const ExpressError = require("./utilities/ExpressError");
const catchAsync = require("./utilities/catchAsync");
const session = require("express-session");
const flash = require("connect-flash");

const campgrounds = require("./routes/campgrounds");
const reviews = require("./routes/reviews");

mongoose
  .connect("mongodb://localhost:27017/yelp-camp")
  .then(() => console.log("We are a-live."))
  .catch((err) => console.error("Woopsie:", err));

mongoose.connection.on("error", (err) => console.error(err));
mongoose.connection.once("open", () => console.log("Database connected."));

const app = express();
const port = 3000;
const sessionOptions = {
  secret: "hush",
  resave: false,
  saveUninitialized: true,
  cookie: {
    httpOnly: true,
    expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
    maxAge: 1000 * 60 * 60 * 24 * 7,
  },
};

app.engine("ejs", engine);

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: true }));

app.use(session(sessionOptions));
app.use(flash());
app.use((req, res, next) => {
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  next();
});

app.use("/campgrounds", campgrounds);
app.use("/campgrounds/:id/reviews", reviews);

app.get("/", (req, res) => {
  res.render("index");
});

app.all("*", function (req, res, next) {
  next(new ExpressError(404, "Error! Zzap!"));
});

app.use((err, req, res, next) => {
  const { statusCode = 500 } = err;
  if (!err.message) err.message = "Something went wrong, horribly.";
  res.status(statusCode).render("error", { err, statusCode });
});

app.listen(port, () => {
  console.log("Snooping on port:", port);
});
