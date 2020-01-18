const mySql = require('mysql')
const connection = mySql.createConnection({
  host: 'localhost',
  user: 'mfinniga_b6d9_cg',
  password: 'sbg0T0BG9TlqbXD7',
  database: 'mfinniga_goals'
})

connection.connect()

module.exports = connection