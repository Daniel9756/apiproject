const express = require("express");
const router = express.Router();
const pool = require("./pg");
const randomId = require("random-id");
const checkAuth = require("./checkAuth");

router.post("/:articleId/:comments", checkAuth, (req, res, next) => {
  const id = randomId();
  const articleId = req.params.articleId;
  const { text, authorId } = req.body;
  pool
    .query(
      "INSERT INTO articlecomments(id, 'articleId', text, 'authorId') VALUES($1, $2, $3, $4) RETURNING *",
      [id, articleId, text, authorId]
    )
    .then(data => {
      res.status(200).json({
        message: "Comment successfully created",
        createdOn: new Date(),
        id: id,
        data: data.rows[0]
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
