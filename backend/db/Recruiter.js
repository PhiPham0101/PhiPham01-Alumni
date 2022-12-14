const mongoose = require("mongoose");

let schema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    code: {
      type: String,
    },
    course: {
      type: String,
    },
    status:{
      type: Boolean,
    },
    contactNumber: {
      type: String,
      validate: {
        validator: function (v) {
          return v !== "" ? /\+\d{1,3}\d{10}/.test(v) : true;
        },
        msg: "Số điện thoại không hợp lệ!",
      },
    },
    bio: {
      type: String,
    },
    is_admin: {
      type: Boolean,
      default: false,
    },
  },
  { collation: { locale: "en" } }
);
module.exports = mongoose.model("RecruiterInfo", schema);
