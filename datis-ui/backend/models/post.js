const mongoose = require("mongoose");

const postSchema = mongoose.Schema({
  name: { type: String, required: true },
  salary: { type: Number, required: true },
  eid: { type: Number, unique: true },
  deductions: { type: Number },
  final: { type: Number },
  creator: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
});

module.exports = mongoose.model("Post", postSchema);
