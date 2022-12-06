const multer = require("multer");
const express = require("express");
const router = express.Router();

const Storage =multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "./public/profile");
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname);
    }
});

var upload = multer({ storage: Storage}).single("fileImage");

router.post("/profile", (req, res) => {
    upload(req, res, err => {
        if(err){
            return res.send(err)
        } else {
            res.status(200).json({
                message: "Success",
              });
        }
    })

});

module.exports = router;