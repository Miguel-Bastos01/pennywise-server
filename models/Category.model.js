const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const categorySchema = new Schema({
  name: {
    type: String,
    required: [true, "Enter name of category"],
    maxlength: 20,
    trim: true,
  },
  icon: {
    type: String,
    maxlength: 2, 
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
});

module.exports = model("Category", categorySchema);
