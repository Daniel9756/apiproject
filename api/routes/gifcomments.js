const express = require("express");
const router = express.Router();
const pool = require("./pg");
const randomId = require("random-id");
// const checkAuth = require("./checkAuth");

router.post("/:gifId/gifComment", (req, res, next) => {
  const id = randomId();
  // const articleId = req.params.id;
  const { gifId, gifComment, authorName } = req.body;

  console.log(gifId, gifComment, authorName)
  console.log(gifId)

pool
  .query(
    'INSERT INTO gifcomments ( id, "gifId", "gifComment", "authorName") VALUES($1, $2, $3, $4) RETURNING *',
    [id, gifId, gifComment, authorName]
  )
  .then((data) => {
    console.log(data)
    res.status(200).json({
      message: "Comment successfully created",
      createdOn: new Date(),
      commentid: id,
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

module.exports = router;
