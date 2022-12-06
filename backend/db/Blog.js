const mongoose = require("mongoose");

let schema = new mongoose.Schema(
  {
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
      },
    title: {
      type: String,
    },
    postname: {
      type: String,
    },
    avatar: {
      type: String,
    },
    dateOfPosting: {
      type: Date,
      default: Date.now,
    },
  },
  { collation: { locale: "en" } }
);

module.exports = mongoose.model("blogs", schema);
