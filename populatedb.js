const { Client } = require("pg");
const projects = require("./projects.json");
require("dotenv").config();

for (var i = 0; i < projects.length; i++) {
  const client = new Client({});
  client.connect();

  const sqlstring =
    "INSERT INTO projects(project_name, description, lang, active, mirrored, url, blog, categories) VALUES($1, $2, $3, $4, $5, $6, $7, $8)";
  const values = Object.values(projects[i]);

  client.query(sqlstring, values, (err, res) => {
    if (err) {
      console.log(err);
    } else {
      client.end();
    }
  });
}
