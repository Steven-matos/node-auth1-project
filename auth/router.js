const bcrypt = require("bcryptjs");
const router = require("express").Router();

const Users = require("../users/users-model");

router.post("/register", (req, res) => {
  const userInfo = req.body;

  const ROUNDS = process.env.HASHING_ROUNDS || 8;
  const hash = bcrypt.hashSync(userInfo.password, ROUNDS);

  userInfo.password = hash;

  Users.add(userInfo)
    .then(user => {
      res.json(user);
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({
        message: "Failed to save user",
        error: err
      });
    });
});

router.post("/login", (req, res) => {
  const { username, password } = req.body;

  Users.getBy({ username })
    .then(([user]) => {
      if (user && bcrypt.compareSync(password, user.password)) {
        req.session.user = {
          id: user.id,
        };
        res.status(200).json(`Logged in!`);
      } else {
        res.status(401).json({ message: "You shall not pass!" });
      }
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({
        message: "Error finding the User",
        error: err
      });
    });
});

module.exports = router;
