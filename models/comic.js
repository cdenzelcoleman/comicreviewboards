const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const commentSchema = new Schema(
  {
    text: { type: String, required: true },
    author: { type: Schema.Types.ObjectId, ref: 'User' },
  },
  { timestamps: true }
);

const comicSchema = new Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    categories: [
      {
        type: String,
        enum: ['Fantasy', 'Sci-Fi', 'Horror', 'Adventure', 'Drama', 'Manga', 'Comedy'],
        default: 'Fantasy',
      },
    ],
    format: {
      type: String,
      enum: ['Trade Paperback', 'Graphic Novel', 'Comicbook', 'Comic Book'], 
      required: true,
    },
    rating: { type: Number, min: 1, max: 5, required: true, default: 3 },
    image: {
      type: String,
      validate: {
        validator: (v) => /^https?:\/\/.+\.(jpg|jpeg|png|gif|svg)$/i.test(v),
        message: 'Invalid image URL. Must be a direct link to an image file.',
      },
      default: 'https://i.imgur.com/OJnlOy8.jpeg',
    },
    owner: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    comments: [
      {
        text: { type: String, required: true },
        author: { type: Schema.Types.ObjectId, ref: 'User' },
        createdAt: { type: Date, default: Date.now },
      },
    ],
  },
  { timestamps: true }
);
const Comic = mongoose.model('Comic', comicSchema);
module.exports = Comic;