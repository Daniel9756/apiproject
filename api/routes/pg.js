const Pool = require("pg").Pool;
const pool = new Pool({
  user: "Platformdb_user",
  password: "Danielson2020$",
  host: "localhost",
  port: 5432,
  database: "Platformdb"
});

module.exports = pool;
