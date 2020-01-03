-- select all projects using FTS 

SELECT *
FROM searching
WHERE project_id IN
      (SELECT project_id FROM projects
       WHERE ${cats} && categories);

