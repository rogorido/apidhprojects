const { Pool, Client } = require("pg");
// const projects = require("./projects.json");
require("dotenv").config();

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: `dhprojects`,
  port: `5432`
});

for (var i = 0; i < projects.length; i++) {
  pool.query();
}
