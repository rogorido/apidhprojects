-- Get all categories from the array of categories

SELECT DISTINCT UNNEST(categories) AS category
FROM projects ORDER BY category;
