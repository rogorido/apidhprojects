-- select all projects using FTS 

SELECT *
FROM searching
WHERE to_tsquery('english', $1) @@ searchterms
      AND project_id IN
      (SELECT project_id FROM works_categories
       WHERE category_id IN ($2:raw));

