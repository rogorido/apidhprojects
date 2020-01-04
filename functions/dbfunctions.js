const path = require("path");
const pgp = require("pg-promise")(/* options */);

username = process.env.PROXY_USER_NAME;
password = process.env.PROXY_USER_PASS;
pgport = process.env.PGPORT;

const db = pgp(
  `postgres://${username}:${password}@localhost:${pgport}/dhprojects`
);

// Helper for linking to external query files:
function sql(file) {
  const fullPath = path.join(__dirname, file);
  return new pgp.QueryFile(fullPath, { minify: true });
}

const sqlGetCategories = sql("../sqls/categories.sql");
const sqlFindProjectsSimple = sql("../sqls/querysimple.sql");
const sqlFindProjectsComplex = sql("../sqls/querywithcats.sql");
const sqlFindProjectsOnlyCategories = sql("../sqls/queryonlycats.sql");

async function getCategories(request, response) {
  const rowList = await db.query(sqlGetCategories);
  response.send(rowList);
}

async function getProjects(request, response) {
  let rowList = [];

  // there are no terms, only cats
  if (!request.query.term && request.query.cat) {
    let cats = Array.isArray(request.query.cat)
      ? request.query.cat.join(",")
      : request.query.cat;

    //cats = ["adultos", "literature"];
    joder = { cats };
    console.log(joder["cats"]);
    console.log(joder);

    rowList = await db.query(sqlFindProjectsOnlyCategories, joder);
  } else if (!request.query.cat && request.query.term) {
    let terms = Array.isArray(request.query.term)
      ? request.query.term.join(":*&")
      : request.query.term;

    // we need to add at the end :*
    terms = `${terms}:*`;
    console.log(terms);
    rowList = await db.query(sqlFindProjectsSimple, terms);
  } else {
    // terms and cats

    let cats = Array.isArray(request.query.cat)
      ? request.query.cat.join(",")
      : request.query.cat;

    let terms = Array.isArray(request.query.term)
      ? request.query.term.join(":*&")
      : request.query.term;

    // we need to add at the end :*
    terms = `${terms}:*`;

    let valuestopass = [terms, cats];

    rowList = await db.query(sqlFindWorkTermsCats, valuestopass);
  }
  response.send(rowList);
}

module.exports = { getCategories, getProjects };
