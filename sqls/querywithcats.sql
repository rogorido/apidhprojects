-- select all projects using FTS 

SELECT *
FROM searching
WHERE to_tsquery('english', $1) @@ searchterms
      AND project_id IN
      (SELECT project_id FROM projects
       WHERE $2 && categories);
