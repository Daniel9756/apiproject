const Pool = require("pg").Pool;
const pool = new Pool({
  user: "apiprojectdb_user",
  password: "123456",
  host: "localhost",
  port: 5432,
  database: "apiprojectdb"
});

module.exports = pool;
