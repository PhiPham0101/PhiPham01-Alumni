const mongoose = require("mongoose");

let schema = new mongoose.Schema(
  {
    category: {
      type: String,
      enum: ["job", "applicant"],
      required: true,
    },
    receiverId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    senderId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
  },
  { collation: { locale: "en" } }
);

schema.index({ category: 1, receiverId: 1, senderId: 1 }, { unique: true });

module.exports = mongoose.model("ratings", schema);
