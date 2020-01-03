CREATE TABLE projects (
  project_id serial PRIMARY KEY,
  project_name VARCHAR(200),
  description TEXT,
  lang VARCHAR(25),
  active BOOLEAN,
  mirrored VARCHAR(250),
  url VARCHAR(250), 
  blog VARCHAR(250),
  categories TEXT 
);

