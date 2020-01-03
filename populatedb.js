const { Pool } = require("pg");
const projects = require("./projects.json");
require("dotenv").config();

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: `dhprojects`,
  port: `5432`
});

for (var i = 0; i < projects.length; i++) {
  const sqlstring =
    "INSERT INTO projects(project_name, description, lang, active, mirrored, url, blog, categories) VALUES($1, $2, $3, $4, $5, $6, $7, $8)";
  const values = Object.values(projects[i]);

  pool.query(sqlstring, values, (err, res) => {
    if (err) {
      console.log(err.stack);
    }
  });
}

pool.end();
