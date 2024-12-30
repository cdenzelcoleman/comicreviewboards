const mongoose = require("mongoose");
// Shortcut variable
const Schema = mongoose.Schema;

const userSchema = new Schema({
  username: { type: String, required: true, unique: true}, 
  password: { type: String, required: true },
  comics: [{type: Schema.Types.ObjectId, ref: 'Comic'}]
});

module.exports = mongoose.model("User", userSchema);
