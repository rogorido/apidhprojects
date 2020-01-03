-- select all projects using FTS 

SELECT *
FROM searching
WHERE to_tsquery('english', $1) @@ searchterms;

