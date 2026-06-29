<?php

require_once __DIR__ . '/../includes/db.php';
require_once __DIR__ . '/../includes/response.php';

require_method('GET');

$stmt = db()->query(
    "SELECT id, name, image_url, alt, logo_size, display_order
     FROM client_logos
     WHERE published = 1
     ORDER BY display_order ASC, name ASC"
);

$clients = array_map(static function (array $row): array {
    return [
        'id' => (int) $row['id'],
        'name' => $row['name'],
        'image' => $row['image_url'],
        'alt' => $row['alt'],
        'logoSize' => $row['logo_size'],
    ];
}, $stmt->fetchAll());

send_json(['data' => $clients]);
