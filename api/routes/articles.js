const express = require("express");
const router = express.Router();
const pool = require("./pg");
const randomId = require("random-id");
const checkAuth = require("./checkAuth");

router.get("/", (req, res, next) => {
  pool
    .query("select * from articles")
    .then((data) => {
      res.status(200).json({
        status: "success",
        data: data.rows,
      });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({
        error: err,
      });
    });
});
// checkAuth,

router.post("/", (req, res, next) => {
  console.log(req);
  const { title, text, authorName } = req.body;
  const id = randomId();
  const createdAt = new Date().toLocaleString();
  pool
    .query(
      'INSERT INTO articles (id, title, text, "authorName", "createdAt") VALUES($1, $2, $3, $4, $5) RETURNING *',
      [id, title, text, authorName, createdAt]
    )
    .then((data) => {
      console.log(data.rows[0].title),
        res.status(200).json({
          message: "Article successfully posted",
          id: data.rows[0].id,
          title: data.rows[0].title,
          text: data.rows[0].text,
          authorName: data.rows[0].authorName,
          createdAt: data.rows[0].createdAt,
        });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({
        error: err,
      });
    });
});

router.get("/:id", checkAuth, (req, res, next) => {
  const id = req.params.id;
  pool
    .query("SELECT * FROM articles WHERE id = $1", [id])
    .then((data) => {
      if (!data.rows[0]) {
        return res.status(404).json({
          message: "Incorrect Id",
        });
      } else {
        res.status(200).json({
          authorId: id,
          createdOn: new Date(),
          data: data.rows[0],
          //  data: { title, article, id },
        });
      }
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({
        error: err,
      });
    });
});

router.put("/:id", (req, res, next) => {
  const id = req.params.id;
  const { title, text } = req.body;
  pool
    .query("UPDATE articles SET title=$1, text=$2 WHERE id=$3 RETURNING *", [
      title,
      text,
      id,
    ])
    .then((data) => {
      res.status(200).json({
        message: "Article successfully updated",
        data: { title, text },
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
  const id = req.params.id;
  pool
    .query("DELETE FROM articles WHERE id=$1 RETURNING *", [id])
    .then((data) => {
      console.log(data);
      res.status(200).json({
        message: "Article  successfully deleted",
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
