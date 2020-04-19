require("dotenv").config();

const path = require("path");
const express = require("express");
const multer = require("multer");
const uuid = require("uuid");

// Launch App
const app = express();

// Static Path and Body Parser
app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: false }));

// View Engine
app.set("view engine", "pug");

// Storage for multer
const storage = multer.diskStorage({
  destination: (req, file, func) => {
    func(null, "./public/pictures");
  },
  filename: (req, file, func) => {
    func(null, uuid.v4() + "-" + file.originalname);
  },
});

// File filter to ensure only picture
const fileFilter = (req, file, func) => {
  const mime_type = file.mimetype;
  if (
    mime_type === "image/jpg" ||
    mime_type === "image/jpeg" ||
    mime_type === "image/png"
  )
    func(null, true);
  else func("Images Only!");
};

// Upload varialble
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 1024 * 1024 * 5,
  },
  fileFilter: fileFilter,
}).array("my_image");

//Routes
app.get("/", (req, res) => res.render("index"));
app.post("/upload", (req, res, next) => {
  upload(req, res, (err) => {
    if (err) res.render("index", { message: err });
    else {
      if (req.files.length == 0)
        res.render("index", { message: "Select atleast one picture" });
      else res.render("index", { success: "Pictures uploaded successfully!" });
    }
  });
});

// Creating Server
const PORT = process.env.PORT;
app.listen(PORT, () => console.log(`Server is running on port ${PORT}...`));
