<?php

require_once __DIR__ . '/../includes/db.php';
require_once __DIR__ . '/../includes/response.php';

require_method('GET');

$stmt = db()->query(
    "SELECT id, title, meta, description, image_url, alt, layout, display_order
     FROM featured_works
     WHERE published = 1
     ORDER BY display_order ASC, title ASC"
);

$works = array_map(static function (array $row): array {
    return [
        'id' => (int) $row['id'],
        'title' => $row['title'],
        'meta' => $row['meta'],
        'description' => $row['description'],
        'image' => $row['image_url'],
        'alt' => $row['alt'],
        'layout' => $row['layout'],
        'className' => 'project-card project-card-' . $row['layout'],
    ];
}, $stmt->fetchAll());

send_json(['data' => $works]);
