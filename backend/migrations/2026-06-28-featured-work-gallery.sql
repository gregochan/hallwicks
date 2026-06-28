CREATE TABLE IF NOT EXISTS featured_work_images (
  id INT AUTO_INCREMENT PRIMARY KEY,
  work_id INT NOT NULL,
  image_url VARCHAR(500) NOT NULL,
  alt VARCHAR(255) NOT NULL,
  display_order INT NOT NULL DEFAULT 0,
  is_cover TINYINT(1) NOT NULL DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_featured_work_images_work (work_id, display_order, id),
  CONSTRAINT fk_featured_work_images_work
    FOREIGN KEY (work_id) REFERENCES featured_works(id)
    ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO featured_work_images (work_id, image_url, alt, display_order, is_cover)
SELECT id, image_url, alt, 0, 1
FROM featured_works fw
WHERE image_url <> ''
  AND NOT EXISTS (
    SELECT 1
    FROM featured_work_images fwi
    WHERE fwi.work_id = fw.id
  );
