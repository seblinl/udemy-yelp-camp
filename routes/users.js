const express = require("express");
const User = require("../models/user");
const catchAsync = require("../utilities/catchAsync");

const router = express.Router({ mergeParams: true });

router.get("/register", (req, res) => {
  res.render("users/register");
});

router.post(
  "/register",
  catchAsync(async (req, res, next) => {
    try {
      const { username, password, email } = req.body.user;
      const user = new User({ username, email });
      const registeredUser = await User.register(user, password);
      console.log(registeredUser);
      req.flash("success", "User has been registered.");
      res.redirect("/");
    } catch (err) {
      req.flash("error", err.message);
      res.redirect("/users/register");
    }
  })
);

module.exports = router;
