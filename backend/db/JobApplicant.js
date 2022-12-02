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
    
    education: [
      {
        institutionName: {
          type: String,
        },
        startYear: {
          type: Number,
          min: 1930,
          max: new Date().getFullYear(),
          validate: Number.isInteger,
        },
        endYear: {
          type: Number,
          max: new Date().getFullYear(),
          validate: [
            { validator: Number.isInteger, msg: "Năm phải là một số nguyên" },
            {
              validator: function (value) {
                return this.startYear <= value;
              },
              msg: "Năm kết thúc phải lớn hơn hoặc bằng Năm bắt đầu",
            },
          ],
        },
      },
    ],
    skills: [String],

    resume: {
      type: String,
    },

    profile: {
      type: String,
    },
  },
  { collation: { locale: "en" } }
);

module.exports = mongoose.model("JobApplicantInfo", schema);
