const express = require("express");
const router = express.Router();
const pool = require("./pg");
const randomId = require("random-id");
const checkAuth = require("./checkAuth");

router.post("/:gifId/:comments", checkAuth, (req, res, next) => {
  const gifId = req.params.gifId;
  const { text, authorId } = req.body;
  const id = randomId();
  pool
    .query(
      "INSERT INTO gifcomments (id, authorId, text, gifId) VALUES($1, $2, $3, $4) RETURNING *",
      [id, authorId, text, gifId]
    )
    .then(data => {
      res.status(201).json({
        message: "Comment successfully created",
        createdOn: new Date(),
        data: {
          id: id,
          comment: data.rows[0]
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

module.exports = router;
