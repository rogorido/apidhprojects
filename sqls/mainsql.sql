CREATE TABLE projects (
  project_id serial PRIMARY KEY,
  project_name VARCHAR(200),
  description TEXT,
  lang VARCHAR(25),
  active BOOLEAN,
  mirrored VARCHAR(250),
  url VARCHAR(250), 
  blog VARCHAR(250),
  categories TEXT[]
);

CREATE MATERIALIZED VIEW searching
AS
SELECT project_id, project_name, description, lang,
       active, mirrored, url, blog, categories,
       to_tsvector('english', concat_ws('; ', project_name,
       description, categories)) AS searchterms
FROM projects
ORDER BY project_name;
CREATE INDEX ON searching USING gin(searchterms);



