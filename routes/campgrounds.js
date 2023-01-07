const express = require("express");
const ExpressError = require("../utilities/ExpressError");
const catchAsync = require("../utilities/catchAsync");
const Campground = require("../models/campground");
const { campgroundSchema } = require("../schemas");

const router = express.Router();

const validateCampground = (req, res, next) => {
  const { error } = campgroundSchema.validate(req.body);
  if (error) {
    const msg = error.details.map((el) => el.message).join(",");
    throw new ExpressError(400, msg);
  } else {
    next();
  }
};

router.get("/new", (req, res) => {
  res.render("campgrounds/new");
});

router.post(
  "/",
  validateCampground,
  catchAsync(async (req, res, next) => {
    const campground = new Campground(req.body.campground);
    await campground.save();
    req.flash(
      "success",
      `Succsessfully added the ${campground.title} campground.`
    );
    res.redirect(`/campgrounds/${campground._id}`);
  })
);

router.get(
  "/:id/edit",
  catchAsync(async (req, res, next) => {
    const campground = await Campground.findById(req.params.id);
    if (!campground) {
      req.flash("error", "The campground can't be found.");
      return res.redirect("/campgrounds");
    }
    res.render("campgrounds/edit", { campground });
  })
);

router.put(
  "/:id",
  validateCampground,
  catchAsync(async (req, res, next) => {
    const campground = await Campground.findByIdAndUpdate(
      req.params.id,
      req.body.campground
    );
    req.flash(
      "success",
      `Successfully updated the ${campground.title} campground.`
    );
    res.redirect(`/campgrounds/${campground._id}`);
  })
);

router.get(
  "/:id",
  catchAsync(async (req, res, next) => {
    const campground = await Campground.findById(req.params.id).populate(
      "reviews"
    );
    if (!campground) {
      req.flash("error", "The campground can't be found.");
      return res.redirect("/campgrounds");
    }
    res.render("campgrounds/details", { campground });
  })
);

router.delete(
  "/:id",
  catchAsync(async (req, res, next) => {
    const campground = await Campground.findByIdAndDelete(req.params.id);
    req.flash(
      "success",
      `Successfully deleted the ${campground.title} campgorund.`
    );
    res.redirect("/campgrounds");
  })
);

router.get(
  "/",
  catchAsync(async (req, res, next) => {
    const campgrounds = await Campground.find({});
    res.render("campgrounds/index", { campgrounds });
  })
);

module.exports = router;
