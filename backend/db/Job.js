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
    postname: {
      type: String,
      required: true,
    },
    companyname: {
      type: String,
      required: true,
    },
    linkwebsite: {
      type: String,
      required: true,
    },
    maxApplicants: {
      type: Number,
      validate: [
        {
          validator: Number.isInteger,
          msg: "maxApplicants should be an integer",
        },
        {
          validator: function (value) {
            return value > 0;
          },
          msg: "maxApplicants should greater than 0",
        },
      ],
    },
    maxPositions: {
      type: Number,
      validate: [
        {
          validator: Number.isInteger,
          msg: "maxPostions should be an integer",
        },
        {
          validator: function (value) {
            return value > 0;
          },
          msg: "maxPositions should greater than 0",
        },
      ],
    },
    activeApplications: {
      type: Number,
      default: 0,
      validate: [
        {
          validator: Number.isInteger,
          msg: "Các ứng viên nộp đơn phải là một số nguyên",
        },
        {
          validator: function (value) {
            return value >= 0;
          },
          msg: "Các ứng viên nộp đơn phải lớn hơn 0",
        },
      ],
    },
    acceptedCandidates: {
      type: Number,
      default: 0,
      validate: [
        {
          validator: Number.isInteger,
          msg: "Các ứng viên được chấp nhận phải là một số nguyên",
        },
        {
          validator: function (value) {
            return value >= 0;
          },
          msg: "Các ứng viên được chấp nhận phải lớn hơn 0",
        },
      ],
    },
    dateOfPosting: {
      type: Date,
      default: Date.now,
    },
    deadline: {
      type: Date,
      validate: [
        {
          validator: function (value) {
            return this.dateOfPosting < value;
          },
          msg: "Thời hạn phải lớn hơn ngày đăng tuyển",
        },
      ],
    },
    skillsets: [String],
    jobType: {
      type: String,
      required: true,
    },
    salary: {
      type: Number,
      validate: [
        {
          validator: Number.isInteger,
          msg: "Lương phải là một số nguyên",
        },
        {
          validator: function (value) {
            return value >= 0;
          },
          msg: "Mức lương phải rõ ràng",
        },
      ],
    },
    // rating: {
    //   type: Number,
    //   max: 5.0,
    //   default: -1.0,
    //   validate: {
    //     validator: function (v) {
    //       return v >= -1.0 && v <= 5.0;
    //     },
    //     msg: "Xếp hạng không thành công",
    //   },
    // },
    info: {
      type: String,
      required: true,
    },
  },
  { collation: { locale: "en" } }
);

module.exports = mongoose.model("jobs", schema);
