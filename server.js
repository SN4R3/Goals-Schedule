const express = require("express");
const app = express();
const connection = require("./connection");
const bodyParser = require("body-parser");

const path = require('path');
const helmet = require("helmet");
const sessions = require("client-sessions");
const pureify = require("./middleware/pureify");

const auth = require('./routes/auth');
const goal = require('./routes/goal')
const category = require('./routes/category')
const milestone = require('./routes/milestone')

app.use(express.static(path.join(__dirname, 'client/build')));

//Middleware
app.use(
  sessions({
    cookieName: "session",
    secret: "wwofdasd9432i423ijfs",
    duration: 30 * 60 * 1000,
    httpOnly: true
  })
);

app.use(helmet());

app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: true
  })
);

app.use(pureify);

// Authenticate
app.use((req, res, next) => {
  if (!(req.session && req.session.userId)) {
    return next();
  }
  connection.query(
    `SELECT * FROM users WHERE id = ?`,
    [req.session.userId],
    (err, user) => {
      if (err) throw error;
      if (!user[0]) {
        return next();
      }
      user.password = undefined;
      req.user = user[0];
      res.locals.user = user[0];

      next();
    }
  );
});

//Routes
app.use('/api/auth', auth);
app.use('/api/goal', goal);
app.use('/api/category', category)
app.use('/api/milestone', milestone)

const port = process.env.PORT || 5000;
app.listen(port, '0.0.0.0', (err) => {
    if(err) throw err 
    console.log(`Server running on port ${port}`) 
});
