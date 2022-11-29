const mongoose = require("mongoose");

let schema = new mongoose.Schema(
  {
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
      },
    title: {
      type: String,
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    likeCount: {
      type: Number,
      default: 0,
    },
  },
  { collation: { locale: "en" } }
);

module.exports = mongoose.model("blogs", schema);
