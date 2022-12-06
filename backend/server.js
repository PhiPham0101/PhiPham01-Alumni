const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const passportConfig = require("./lib/passportConfig");
const cors = require("cors");
const fs = require("fs");

const url = require("url");
const router = express.Router();

// MongoDB
mongoose
  .connect("mongodb+srv://admin:uAOVoZzLDadbIQbu@alumni.g4ctquo.mongodb.net/?retryWrites=true&w=majority", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false,
  })
  .then((res) => console.log("Connected to DB"))
  .catch((err) => console.log(err));

// initialising directories
if (!fs.existsSync("./public")) {
  fs.mkdirSync("./public");
}
if (!fs.existsSync("./public/resume")) {
  fs.mkdirSync("./public/resume");
}
if (!fs.existsSync("./public/profile")) {
  fs.mkdirSync("./public/profile");
}

const app = express();
const port = 4444;

app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies

// Setting up middlewares
app.use(cors());
app.use(express.json());
app.use(passportConfig.initialize());

// Routing
app.use("/auth", require("./routes/authRoutes"));
app.use("/api", require("./routes/apiRoutes"));
app.use("/upResume", require("./routes/uploadRoutes"));
app.use("/host", require("./routes/downloadRoutes"));
app.use("/upImage", require("./routes/uploadImage"));

app.use('/', router.get("/image/:file", async (req, res) => {
  var params = url.parse(req.url, true).query;
  console.log(params);
  if (!params) {
    res.send('NoData')
  } else {
    const fakeString = __dirname + `/public/profile/${req.params.file}`;

    try {
      fs.readFile(fakeString, function (err, data) {
        if (!err) {
          res.end(data);
        } else {
          console.log(err);
          res.end(err);
        }
      })
    } catch (error) {
      console.log(error);
    }
  }
}));

app.use('/', router.get("/resume/:file", async (req, res) => {
  var params = url.parse(req.url, true).query;
  console.log(params);
  if (!params) {
    res.send('NoData')
  } else {
    const fakeString = __dirname + `/public/resume/${req.params.file}`;

    try {
      fs.readFile(fakeString, function (err, data) {
        if (!err) {
          res.end(data);
        } else {
          console.log(err);
          res.end(err);
        }
      })
    } catch (error) {
      console.log(error);
    }
  }
}));

app.listen(port, () => {
  console.log(`Server started on port ${port}!`);
});