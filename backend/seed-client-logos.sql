START TRANSACTION;

DELETE FROM client_logos
WHERE name IN (
  'Great People',
  'Branemark Osseointegration Center',
  '2i Dental Centre',
  'The Dental Network',
  'More Dental Orange',
  'Arrail Dental',
  'Town Health',
  'HKHC',
  'VSH',
  'Tin Hau Pet Hospital',
  'Marubeni'
);

INSERT INTO client_logos
  (name, image_url, alt, logo_size, display_order, published, source)
VALUES
  ('Great People', '/backend/uploads/clients/public/great-people.webp', 'Great People logo', 'wide', 10, 1, 'admin'),
  ('Branemark Osseointegration Center', '/backend/uploads/clients/public/branemark-osseointegration.webp', 'Branemark Osseointegration Center logo', 'mark', 20, 1, 'admin'),
  ('2i Dental Centre', '/backend/uploads/clients/public/2i-dental-centre.webp', '2i Dental Centre logo', 'wide', 30, 1, 'admin'),
  ('The Dental Network', '/backend/uploads/clients/public/the-dental-network.webp', 'The Dental Network logo', 'mark', 40, 1, 'admin'),
  ('More Dental Orange', '/backend/uploads/clients/public/moredental-orange.webp', 'More Dental Orange logo', 'wide', 50, 1, 'admin'),
  ('Arrail Dental', '/backend/uploads/clients/public/arrail.webp', 'Arrail Dental logo', 'wide', 60, 1, 'admin'),
  ('Town Health', '/backend/uploads/clients/public/town-health.webp', 'Town Health logo', 'wide', 70, 1, 'admin'),
  ('HKHC', '/backend/uploads/clients/public/hkhc.webp', 'HKHC logo', 'wide', 80, 1, 'admin'),
  ('VSH', '/backend/uploads/clients/public/vsh.webp', 'VSH logo', 'mark', 90, 1, 'admin'),
  ('Tin Hau Pet Hospital', '/backend/uploads/clients/public/tinhau-pet.webp', 'Tin Hau Pet Hospital logo', 'wide', 100, 1, 'admin'),
  ('Marubeni', '/backend/uploads/clients/public/marubeni.webp', 'Marubeni logo', 'wide', 110, 1, 'admin');

COMMIT;
