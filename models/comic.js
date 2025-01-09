const mongoose = require("mongoose");
const mongoosePaginate = require("mongoose-paginate-v2");

const commentSchema = new mongoose.Schema({
  text: { type: String, required: true },
  author: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
}, { timestamps: true });

const comicSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  categories: [
    {
      type: String,
      enum: [
        "Fantasy",
        "Sci-Fi",
        "Horror",
        "Adventure",
        "Drama",
        "Manga",
        "Comedy",
      ],
    },
  ],
  format: {
    type: String,
    enum: ["Trade Paperback", "Graphic Novel", "Comicbook"],
    required: true,
  },
  rating: { type: Number, min: 1, max: 5, required: true },
  image: {
    type: String,
    validate: {
      validator: (v) => /^https?:\/\/.+\.(jpg|jpeg|png|gif|svg)$/i.test(v),
      message: "Invalid image URL. Must be a direct link to an image file.",
    },
  },
  owner: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  comments: [commentSchema],
}, { timestamps: true });

// Apply the pagination plugin
comicSchema.plugin(mongoosePaginate);

module.exports = mongoose.model("Comic", comicSchema);
