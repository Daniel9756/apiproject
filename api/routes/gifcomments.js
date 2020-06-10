const express = require("express");
const router = express.Router();
const pool = require("./pg");
const randomId = require("random-id");
// const checkAuth = require("./checkAuth");

router.post("/:gifId/gifComment", (req, res, next) => {
  const id = randomId();
  // const articleId = req.params.id;
  const { gifId, title, gifComment, authorName } = req.body;

  console.log(gifId, title, authorName)
  console.log(gifId)

pool
  .query(
    'INSERT INTO gifcomments ( id, "gifId", title, "gifComment", "authorName") VALUES($1, $2, $3, $4, $5) RETURNING *',
    [id, gifId, title, gifComment, authorName]
  )
  .then((data) => {
    console.log(data)
    res.status(200).json({
      message: "Comment successfully created",
      createdOn: new Date(),
      id: id,
      gifComment,
      authorName
    });
  })
  .catch((err) => {
    console.log(err);
    res.status(500).json({
      error: err,
    });
  });
});

router.delete("/:id", (req, res, next) => {
  const id = req.body.id;
  pool
    .query("DELETE FROM gifComments WHERE id=$1 RETURNING *", [id])
    .then((data) => {
        console.log(data)
      res.status(200).json({
        message: " Gif comment successfully deleted",
        Id: id,

      });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({
        error: err,
      });
    });
});

module.exports = router;
