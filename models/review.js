const mongoose = require("mongoose");
const { Schema } = mongoose;

const ReviewSchema = new Schema({
  body: { type: String },
  rating: { type: Number },
});

module.exports = mongoose.model("Review", ReviewSchema);
