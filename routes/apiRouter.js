const express = require("express");
const Users = require("../models/user-models");
const router = express.Router();
const jwt = require("jsonwebtoken");
const restricted = require("../middleware/restricted-middleware");
const bcrypt = require("bcryptjs");

router.post("/register", (req, res) => {
  const body = req.body;

  if (!body.username || !body.password || !body.department) {
    res.status(400).json({
      message: "username, password, and department fields are required"
    });
  } else {
    const hash = bcrypt.hashSync(body.password, 8);
    const user = { ...body, password: hash };
    Users.add(user)
      .then(newUser => {
        res.status(201).json(newUser);
      })
      .catch(err => {
        console.log(err);
        res.status(500).json({
          message: "There was an error adding the user to the db"
        });
      });
  }
});

router.post("/login", (req, res) => {
  const body = req.body;
  if (!body.username || !body.password) {
    res
      .status(400)
      .json({ message: "username and password fields are required" });
  } else {
    Users.getUserByUsername(body.username)
      .then(dbUser => {
        if (dbUser && bcrypt.compareSync(body.password, dbUser.password)) {
          const token = generateToken(dbUser);
          res
            .status(200)
            .json({ message: "Welcome! Here's that token.", token });
        } else {
          res.status(401).json({ message: "You shall not pass!" });
        }
      })
      .catch(err => {
        console.log(err);
        res
          .status(500)
          .json({ message: "There was an error retrieving the hashed pass" });
      });
  }
});

function generateToken(user) {
  const payload = {
    subject: user.id,
    username: user.username
  };
  const options = {
    expiresIn: "5h"
  };
  return jwt.sign(payload, "my fancy shmancy secret", options);
}

router.get("/users", restricted, (req, res) => {
  Users.find()
    .then(users => {
      res.status(200).json(users);
    })
    .catch(err => {
      console.log(err);
      res
        .status(500)
        .json({ message: "There was a server error getting all the users" });
    });
});

module.exports = router;
