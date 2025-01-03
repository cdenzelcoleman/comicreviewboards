const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const comicSchema = new Schema({
  title: { type: String, required: true},
  description: { type: String, required: true },
  categor: {
    type: String,
    enum:['Fantasy', 'Sci-Fi', 'Horror', 'Adventure', 'Drama','Manga','Comedy' ],
    required: true
  },
  format: {
    type: String,
    enum: ['Trade Paperback', 'Graphic Novel', 'Comicbook'],
    required: true
  },
  rating: { type: Number, min: 1, max: 5, required: true },
  image: { type: String},
  owner: {type: Schema.Types.ObjectId, ref: 'User', required: true},
  comments: [
    {
        text:{ type: String, required: true },
        author: { type: Schema.Types.ObjectId, ref:'User'},
        createdAt: {type:Date, default: Date.now }
    }
  ]
  
    
  }, {timestamps: true});
 
module.exports = mongoose.model("Comic", comicSchema);
