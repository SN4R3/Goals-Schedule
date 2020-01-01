const express = require("express");
const router = express.Router();
const connection = require("../connection");

const uuid = require('uuid/v4')
const moment = require("moment");
const bcrypt = require("bcrypt");
const saltRounds = 10;

router.post("/register", (req, res) => {
  const { name, email, password } = req.body;
  // check if email exists
  connection.query(
    `SELECT * FROM users WHERE email = ?`,
    [email],
    (err, rows) => {
      //if (err) json({error: '500', message: `User Check Error`})
      if (err) throw err;
      if (rows.length) {
        res.json({
          error: "23000",
          message: `Email '${email}' is already in use.`
        });
      } else {
        // Hash password
        bcrypt.hash(password, saltRounds, function(err, hash) {
          //if (err) json({error: '500', message: `Password Error`})
          if (err) throw err;
          // Store User
          let query = `
          INSERT INTO users (id, name, email, password, created_at)
          VALUES(?,?,?,?,?);
        `;
          connection.query(
            query,
            [uuid(), name, email, hash, moment().format()],
            err => {
              //if (err) json({error: '500', message: `Registration Error`})
              if (err) throw err;
              // TODO Log user in
              res.json({ name, email });
            }
          );
        });
      }
    }
  );
});

router.post("/login", (req, res) => {
  const invalidMsg =
    "The email & password you entered does not match our records";
  const { email, password } = req.body;

  let query = `
    SELECT * from users WHERE email = ? LIMIT 1
  `;
  connection.query(query, [email], (err, rows) => {
    //if(err) res.json({error: 'Failed to fetch user', message: 'Something went wrong, please try again.'})
    if (err) throw err;
    if (!rows.length) res.json({ error: "Invalid", message: invalidMsg });
    else {
      bcrypt.compare(password, rows[0].password).then(matched => {
        if (matched) {
          req.session.userId = rows[0].id
          res.json('Success');
        }
        else res.json({ error: "Invalid", message: invalidMsg });
      });
    }
  });
});

router.get('/logout', (req, res) => {
  req.session.userId = null
  res.json('Success')
})

router.get('/user', (req, res) => {
  res.json(req.user)
})

module.exports = router;
