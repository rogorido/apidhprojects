const path = require("path");
// pg-promise initialization options...
const initOptions = {
  query(e) {
    console.log("QUERY:", e.query);
  }
};

//const pgp = require("pg-promise")(initOptions);
const pgp = require("pg-promise")();

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
      ? request.query.cat
      : [request.query.cat];

    // this is not verey clear to me. It seems I need this structure:
    // https://github.com/vitaly-t/pg-promise/issues/690
    // [['America', 'literature']]
    // this is why I create an array if we only have one element, and then
    // I use again [ ] here below...
    rowList = await db.query(sqlFindProjectsOnlyCategories, [cats]);
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
      ? request.query.cat
      : [request.query.cat];

    let terms = Array.isArray(request.query.term)
      ? request.query.term.join(":*&")
      : request.query.term;

    // we need to add at the end :*
    terms = `${terms}:*`;

    // see above for this use of [cats]. And here
    // https://github.com/vitaly-t/pg-promise/issues/690
    let valuestopass = [terms, [cats]];

    rowList = await db.query(sqlFindProjectsComplex, valuestopass);
  }
  response.send(rowList);
}

module.exports = { getCategories, getProjects };
