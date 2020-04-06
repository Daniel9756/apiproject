const express = require("express");
const router = express.Router();
const pool = require("./pg");
const randomId = require("random-id");
const checkAuth = require("./checkAuth");

router.post("/:articlesId/comment", (req, res, next) => {
  const id = randomId();
  // const articleId = req.params.id;
  const {articleId, comment, authorName } = req.params;
  console.log(articleId)

pool
  .query(
    'INSERT INTO comments ( id, "articleId", comment, "authorName") VALUES($1, $2, $3, $4) RETURNING *',
    [id, articleId, comment, authorName]
  )
  .then((data) => {
    res.status(200).json({
      message: "Comment successfully created",
      createdOn: new Date(),
      id: id,
      data: comment,
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
