CREATE TABLE IF NOT EXISTS featured_works (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  meta VARCHAR(255) NOT NULL,
  description TEXT NULL,
  image_url VARCHAR(500) NOT NULL,
  alt VARCHAR(255) NOT NULL,
  layout ENUM('large', 'tall', 'square', 'wide', 'small') NOT NULL DEFAULT 'small',
  display_order INT NOT NULL DEFAULT 0,
  published TINYINT(1) NOT NULL DEFAULT 1,
  source ENUM('admin', 'telegram', 'whatsapp', 'api') NOT NULL DEFAULT 'admin',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_featured_works_public (published, display_order, title)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

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

CREATE TABLE IF NOT EXISTS client_logos (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  image_url VARCHAR(500) NOT NULL,
  alt VARCHAR(255) NOT NULL,
  logo_size ENUM('mark', 'wide') NOT NULL DEFAULT 'wide',
  display_order INT NOT NULL DEFAULT 0,
  published TINYINT(1) NOT NULL DEFAULT 1,
  source ENUM('admin', 'api') NOT NULL DEFAULT 'admin',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_client_logos_public (published, display_order, name)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
