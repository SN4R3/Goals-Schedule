const mySql = require('mysql')
const connection = mySql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'goals'
})

connection.connect()

module.exports = connection