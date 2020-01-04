-- Get all categories from the array of categories

WITH j AS 
(SELECT DISTINCT UNNEST(categories) AS category
FROM projects ORDER BY category) 
SELECT category AS value, category AS LABEL FROM j;
