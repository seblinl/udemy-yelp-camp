const mongoose = require("mongoose");
const Review = require("./review");
const { Schema } = mongoose;

const CampgroundSchema = new Schema({
  title: String,
  location: String,
  description: String,
  image: String,
  price: Number,
  reviews: [
    {
      type: Schema.Types.ObjectId,
      ref: "Review",
    },
  ],
});

CampgroundSchema.post("findOneAndDelete", async function (camp) {
  if (camp) {
    await Review.deleteMany({ _id: { $in: camp.reviews } });
  }
});

module.exports = mongoose.model("Campground", CampgroundSchema);
