const dotenv = require("dotenv").config();
const express = require("express");
const router = express.Router();
const multer = require("multer");
const cloudinary = require("cloudinary");
const cloudinaryStorage = require("multer-storage-cloudinary");
const randomId = require("random-id");
const jwt = require("jsonwebtoken");
const checkAuth = require("./checkAuth");
const pool = require("./pg");


/* const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, "./upload/");
  },
  filename: function(req, file, cb) {
    cb(null, Date.now() + file.originalname);
  }
});
const fileFilter = (req, file, cb) => {
  if (file.mimetype === "image/jpg"  || file.mimetype === "image/jpeg"|| file.mimetype === "image/png") {
    cb(null, true);
  } else {
    cb(null, false);
  }
}; */
/* const upload = multer({
  storage: storage,
  limits: {
    fileSize: 1024 * 1024 * 5
  },
 fileFilter: fileFilter
}); */

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET
});

const storage = cloudinaryStorage({
  cloudinary,
  folder: "file",
  allowedFormats: ["jpg", "png", "jpeg"],
  transformation: [{ width: 500, height: 500, crop: "limit" }]
});
const upload = multer({ storage: storage });



router.post("/", upload.single("file"), (req, res, next) => {
  // console.log(upload)
  const file = {};
  console.log(req.file);

  const title = req.body.title;
  file.url = req.file.url;
  file.id = req.file.public_id;
  const id = randomId();
  //const image = req.file
  pool
    .query(
      'INSERT INTO gifs (id, title, image, "gifImages") VALUES($1, $2, $3, $4) RETURNING *',
      [id, title, req.file.url, req.file.public_id]
    )
    .then(data => {
      console.log(data);
            res.status(201).json({
              
        message: "GIF image successfully posted",
        data: {
          title,
          // authorName,
          imageUrl: file.url,
          gifImages: file.id,
          gifId: id,
          createdOn: new Date(),

        }
      });
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({
        error: err
      });
    });
});

router.post("/:id/:comment", checkAuth, (req, res, next) => {
  const id = req.params.id;
  const gifcomment = req.body.comment;
  pool
    .query("INSERT INTO gifs (comment) VALUES($1)", ["comment"])
    .then(data => {
      res.status(201).json({
        message: "Comment successfully created",
        createdOn: new Date(),
        data: {
          id: id,
          comment: gifcomment
        }
      });
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({
        error: err
      });
    });
});

router.get("/", checkAuth, (req, res, next) => {
  pool
    .query("SELECT * FROM gifs")
    .then(data => {
      res.status(200).json({
        data: data.rows
      });
    })

    .catch(err => {
      console.log(err);
      res.status(500).json({
        error: err
      });
    });
});

router.get("/:id", checkAuth, (req, res, next) => {
  const id = req.params.id;
  pool
    .query("SELECT * FROM gifs WHERE id = $1", [id])
    .then(data => {
      res.status(200).json({
        createdOn: new Date(),
        data: {
          result: data.rows,
          comments: [
            {
              commentId: "commentId",
              authorId: "authorId",
              comment: "comment"
            }
          ]
        }
      });
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({
        error: err
      });
    });
});

router.delete("/:id", checkAuth, (req, res, next) => {
  const id = req.params.id;
  pool
    .query("DELETE FROM gifs WHERE id=$1", [id])
    .then(data => {
      res.status(200).json({
        message: "GIF post successfully deleted",
        gifId: id
      });
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({
        error: err
      });
    });
});

module.exports = router;
