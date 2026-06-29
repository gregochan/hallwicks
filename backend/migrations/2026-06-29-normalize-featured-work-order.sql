SET @row_number = 0;

UPDATE featured_works
SET display_order = (@row_number := @row_number + 1)
ORDER BY display_order ASC, title ASC;
