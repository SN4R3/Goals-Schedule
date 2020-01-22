const mySql = require('mysql')
const connection = mySql.createConnection({
  host: '198.57.241.3',
  user: 'mfinniga_b6d9_cg',
  password: '[Nq)fu6Dr!xD',
  database: 'mfinniga_goals'
})

connection.connect()

module.exports = connection
