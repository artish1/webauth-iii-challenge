const express = require("express");
const Users = require("../models/user-models");
const router = express.Router();
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

router.post("/register", (req, res) => {
  const body = req.body;

  if (!body.username || !body.password || !body.department) {
    res.status(400).json({
      message: "username, password, and department fields are required"
    });
  } else {
    bcrypt.hashSync(body.password, 8, (err, hash) => {
      if (err) {
        console.log("Error hashing: ", err);
        res.status(500).json({
          message: "There was a server error trying to hash the password"
        });
      } else {
        const user = { ...body, password: hash };
        Users.add(user)
          .then(newUser => {
            res.status(201).json(newUser);
          })
          .catch(err => {
            console.log(err);
            res
              .status(500)
              .json({
                message: "There was an error adding the user to the db"
              });
          });
      }
    });
  }
});

router.post("/login", (req, res) => {});

router.get("/users", (req, res) => {});

module.exports = router;
