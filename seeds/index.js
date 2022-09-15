const mongoose = require("mongoose");
const cities = require("./cities");
const { descriptors, places } = require("./seedHelpers");
const Campground = require("../models/campground");

mongoose
  .connect("mongodb://localhost:27017/yelp-camp")
  .then(() => console.log("We are a-live."))
  .catch((err) => console.error("Woopsie:", err));

mongoose.connection.on("error", (err) => console.error(err));
mongoose.connection.once("open", () => console.log("Database connected."));

const random = (max) => Math.floor(Math.random() * max);

const getSample = (array) => array[random(array.length)];

const seedDB = async () => {
  await Campground.deleteMany({});
  for (let i = 0; i < 50; i++) {
    const { city, state } = getSample(cities);
    const newCamp = new Campground({
      title: `${getSample(descriptors)} ${getSample(places)}`,
      location: `${city}, ${state}`,
      image: "https://source.unsplash.com/collection/483251",
      description:
        "Lorem ipsum, dolor sit amet consectetur adipisicing elit. Pariatur natus ducimus non, id blanditiis, repellat quaerat suscipit illo alias modi cumque dolorum eum aliquid eos aspernatur facilis, voluptatem quo unde?",
      price: random(99) + 5,
    });
    await newCamp.save();
  }
};

seedDB().then(() => mongoose.connection.close());
