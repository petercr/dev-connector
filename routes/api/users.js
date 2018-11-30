const express = require("express");
const router = express.Router();
const gravatar = require("gravatar");
const bcrypt = require("bcryptjs");

// Load user modal
const User = require("../../modules/User");

// @route   GET api/users/test
// @desc    Tests user route
// @access  Public

router.get("/test", (req, res) => res.json({ msg: "Users works!!" }));

// @route   GET api/users/register
// @desc    Register route
// @access  Public
router.post("/register", (req, res) => {
  User.findOne({ email: req.body.email }).then(user => {
    if (user) {
      return res.status(400).json({ email: "Email already exists" });
    } else {
      const avatar = gravatar.url(req.body.email, {
        s: "200", // Size
        rating: "pg", // picture rating
        default: "mm" // Default
      });

      const newUser = new User({
        name: req.body.name,
        email: req.body.email,
        avatar,
        password: req.body.password
      });

      bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(newUser.password, salt, (err, hash) => {
          if (err) throw err;
          newUser.password = hash;
          newUser
            .save()
            .then(user => res.json(user))
            .catch(err => console.warn(err));
        });
      });
    }
  });
});

module.exports = router;
