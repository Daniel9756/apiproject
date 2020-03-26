const express = require("express");
const router = express.Router();
const pool = require("./pg");
const randomId = require("random-id");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const checkAuth = require("./checkAuth");

router.post("/signup", (req, res, next) => {
  pool
    .query("SELECT * FROM employees WHERE email = $1", [req.body.email])
    .then(data => {
      if (!data.rows[0]) {
        bcrypt.hash(req.body.password, 10, (err, hash) => {
          if (err) {
            return res.status(500).json({
              error: err
            });
          } else {
            const id = randomId();
            const {
              firstName,
              lastName,
              email,
              password,
              gender,
              jobrole,
              dapartment,
              address,
              isAdmin
            } = req.body;

            pool
              .query(
                'INSERT INTO employees (id, "firstName", "lastName", email, password,  gender, "jobRole", department, address, "isAdmin" ) VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING *',
                [
                  id,
                  req.body.firstName,
                  req.body.lastName,
                  req.body.email,
                  hash,
                  req.body.gender,
                  req.body.jobrole,
                  req.body.department,
                  req.body.address,
                  req.body.isAdmin
                ]
              )
              .then(result => {
                console.log(result);
                const token = jwt.sign(
                  {
                    email: result.rows[0].email,
                    userId: result.rows[0].id
                  },
                  process.env.JWT_KEY,
                  {
                    expiresIn: "1h"
                  }
                );
                res.status(200).json({
                  message: "User account successfully created",
                  token: token,              
                  userId: id,
                  user: result.rows[0]
                });
              })
              .catch(err => {
                console.log(err);
                res.status(500).json({
                  error: err
                });
              });
          }
        });
      } else {
        return res.status(400).json({
          message: "Email already in use"
        });
      }
    });
});

router.post("/login", (req, res, next) => {
  pool
    .query("SELECT * FROM employees WHERE email = $1", [req.body.email])
    .then(data => {
      if (!data.rows[0]) {
        res.status(400).json({
          message: "Email does not exists"
        });
      }
      bcrypt
        .compare(req.body.password, data.rows[0].password)
        .then(result => {
          if (result) {
            const token = jwt.sign(
              {
                email: data.rows[0].email,
                userId: data.rows[0].id
              },
              process.env.JWT_KEY,
              {
                expiresIn: "1h"
              }
            );
            res.status(200).json({
              message: "User login successful",
              token: token
            });
          } else {
            throw "Authentication failed";
          }
        })
        .catch(err => {
          console.log(err);
          return res.status(400).json({
            message: "Authentication error"
          });
        });
    });
});

router.delete("/:id", checkAuth, (req, res, next) => {
  const id = req.params.id;
  pool
    .query("DELETE FROM employees WHERE id=$1", [id])
    .then(data => {
      res.status(200).json({
        message: "Employees successfully deleted",
        userId: id
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
