const mongoose = require("mongoose");

let schema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
        },
        blogId: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
        },
        commentcontent: {
            type: String,
            required: true,
        },
        dateOfPosting: {
            type: Date,
            default: Date.now,
        },
    },
    { collation: { locale: "en" } }
);

module.exports = mongoose.model("comments", schema);
