START TRANSACTION;

DELETE FROM featured_works
WHERE title IN (
  'Great People Branemark Center',
  'St. George Medical Center',
  'Conch Hospital',
  'Clinic A K11 TST',
  'Langham Place Orthodontics',
  'Varios Dental Clinic',
  'VSH Wanchai MRI',
  'Monnis Restaurant',
  'Private Residence',
  'Clinic A Dental Section'
);

INSERT INTO featured_works
  (title, meta, description, image_url, alt, layout, display_order, published, source)
VALUES
  (
    'Great People Branemark Center',
    'Shanghai, China // Dental Center // 2019',
    NULL,
    '/backend/uploads/works/public/great-people-branemark-center-01.webp',
    'Great People Shanghai dental center interior',
    'large',
    10,
    1,
    'admin'
  );
SET @work_id = LAST_INSERT_ID();
INSERT INTO featured_work_images (work_id, image_url, alt, display_order, is_cover) VALUES
  (@work_id, '/backend/uploads/works/public/great-people-branemark-center-01.webp', 'Great People Shanghai dental center interior', 0, 1),
  (@work_id, '/backend/uploads/works/public/great-people-branemark-center-02.webp', 'Great People Shanghai dental clinic reception area', 1, 0);

INSERT INTO featured_works
  (title, meta, description, image_url, alt, layout, display_order, published, source)
VALUES
  (
    'St. George Medical Center',
    'Hong Kong // Specialist Clinic // 2019',
    NULL,
    '/backend/uploads/works/public/st-george-medical-center-01.webp',
    'Minimal medical reception and corridor with black structural details',
    'tall',
    20,
    1,
    'admin'
  );
SET @work_id = LAST_INSERT_ID();
INSERT INTO featured_work_images (work_id, image_url, alt, display_order, is_cover) VALUES
  (@work_id, '/backend/uploads/works/public/st-george-medical-center-01.webp', 'Minimal medical reception and corridor with black structural details', 0, 1),
  (@work_id, '/backend/uploads/works/public/st-george-medical-center-02.webp', 'St. George Medical Center clinical interior detail', 1, 0);

INSERT INTO featured_works
  (title, meta, description, image_url, alt, layout, display_order, published, source)
VALUES
  (
    'Conch Hospital',
    'Anhui, China // Dental Department // 2019',
    NULL,
    '/backend/uploads/works/public/conch-hospital-01.webp',
    'Conch Hospital dental department interior',
    'square',
    30,
    1,
    'admin'
  );
SET @work_id = LAST_INSERT_ID();
INSERT INTO featured_work_images (work_id, image_url, alt, display_order, is_cover) VALUES
  (@work_id, '/backend/uploads/works/public/conch-hospital-01.webp', 'Conch Hospital dental department interior', 0, 1);

INSERT INTO featured_works
  (title, meta, description, image_url, alt, layout, display_order, published, source)
VALUES
  (
    'Clinic A K11 TST',
    'Hong Kong // Dental Clinic // 2019',
    NULL,
    '/backend/uploads/works/public/clinic-a-k11-tst-01.webp',
    'Clinic A at K11 dental clinic interior',
    'wide',
    40,
    1,
    'admin'
  );
SET @work_id = LAST_INSERT_ID();
INSERT INTO featured_work_images (work_id, image_url, alt, display_order, is_cover) VALUES
  (@work_id, '/backend/uploads/works/public/clinic-a-k11-tst-01.webp', 'Clinic A at K11 dental clinic interior', 0, 1),
  (@work_id, '/backend/uploads/works/public/clinic-a-k11-tst-02.webp', 'Clinic A dental section detail', 1, 0);

INSERT INTO featured_works
  (title, meta, description, image_url, alt, layout, display_order, published, source)
VALUES
  (
    'Langham Place Orthodontics',
    'Kowloon, Hong Kong // Orthodontics Centre // 2019',
    NULL,
    '/backend/uploads/works/public/langham-place-orthodontics-01.webp',
    'Langham Place orthodontics centre',
    'tall',
    50,
    1,
    'admin'
  );
SET @work_id = LAST_INSERT_ID();
INSERT INTO featured_work_images (work_id, image_url, alt, display_order, is_cover) VALUES
  (@work_id, '/backend/uploads/works/public/langham-place-orthodontics-01.webp', 'Langham Place orthodontics centre', 0, 1);

INSERT INTO featured_works
  (title, meta, description, image_url, alt, layout, display_order, published, source)
VALUES
  (
    'Varios Dental Clinic',
    'Hong Kong // Dental Clinic',
    NULL,
    '/backend/uploads/works/public/varios-dental-clinic-01.webp',
    'Varios Dental Clinic interior',
    'small',
    60,
    1,
    'admin'
  );
SET @work_id = LAST_INSERT_ID();
INSERT INTO featured_work_images (work_id, image_url, alt, display_order, is_cover) VALUES
  (@work_id, '/backend/uploads/works/public/varios-dental-clinic-01.webp', 'Varios Dental Clinic interior', 0, 1);

INSERT INTO featured_works
  (title, meta, description, image_url, alt, layout, display_order, published, source)
VALUES
  (
    'VSH Wanchai MRI',
    'Hong Kong // Veterinary Hospital // MRI Suite',
    NULL,
    '/backend/uploads/works/public/vsh-wanchai-mri-01.webp',
    'VSH Wanchai MRI suite interior',
    'tall',
    70,
    1,
    'admin'
  );
SET @work_id = LAST_INSERT_ID();
INSERT INTO featured_work_images (work_id, image_url, alt, display_order, is_cover) VALUES
  (@work_id, '/backend/uploads/works/public/vsh-wanchai-mri-01.webp', 'VSH Wanchai MRI suite interior', 0, 1);

INSERT INTO featured_works
  (title, meta, description, image_url, alt, layout, display_order, published, source)
VALUES
  (
    'Monnis Restaurant',
    'Mongolia // Hospitality // 2016',
    NULL,
    '/backend/uploads/works/public/monnis-restaurant-01.webp',
    'Monnis Restaurant interior',
    'tall',
    80,
    1,
    'admin'
  );
SET @work_id = LAST_INSERT_ID();
INSERT INTO featured_work_images (work_id, image_url, alt, display_order, is_cover) VALUES
  (@work_id, '/backend/uploads/works/public/monnis-restaurant-01.webp', 'Monnis Restaurant interior', 0, 1);

INSERT INTO featured_works
  (title, meta, description, image_url, alt, layout, display_order, published, source)
VALUES
  (
    'Private Residence',
    'Residential // Interior Design',
    NULL,
    '/backend/uploads/works/public/private-residence-01.webp',
    'Private residence interior',
    'small',
    90,
    1,
    'admin'
  );
SET @work_id = LAST_INSERT_ID();
INSERT INTO featured_work_images (work_id, image_url, alt, display_order, is_cover) VALUES
  (@work_id, '/backend/uploads/works/public/private-residence-01.webp', 'Private residence interior', 0, 1);

COMMIT;
