const express = require("express");
const router = express.Router();
const connection = require("../connection");
const bcrypt = require('bcrypt');
const bodyParser = require('body-parser')
const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
})); 


router.post('/login', (req, res) => {
  const invalidMsg = 'The email & password you entered does not match our records'
  const { email, password } = req.body
  let query = `
    SELECT * from users WHERE email = '${email}' LIMIT 1
  `
  connection.query(query, (err, rows) => {
    //if(err) res.json({error: 'Failed to fetch user', message: 'Something went wrong, please try again.'})
    if(err) throw err
    if(!rows.length)
      res.json({error: 'Invalid', message: invalidMsg})
    else {
      bcrypt.compare(password, rows[0].password).then((matched) => {
        if(matched)
          res.json(rows)
        else
          res.json({error: 'Invalid', message: invalidMsg})
      })
    }
  })
})

module.exports = router