const express = require("express");
const app = express();
const connection = require("./connection");

const moment = require("moment");
const bcrypt = require("bcrypt");
const saltRounds = 10;

const bodyParser = require("body-parser");
app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: true
  })
);

const auth = require("./routes/auth");
const pureify = require("./middleware/pureify");

//Middleware
app.use(pureify);

//Routes
app.use("/api/auth", auth);

app.post("/api/register", (req, res) => {
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
          INSERT INTO users (name, email, password, created_at)
          VALUES(?,?,?,?);
        `;
          connection.query(
            query,
            [name, email, hash, moment().format()],
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

const port = 5000;

app.listen(port, () => `Server running on port ${port}`);
