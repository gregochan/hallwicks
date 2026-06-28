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

$rows = $stmt->fetchAll();
$workIds = array_map(static fn (array $row): int => (int) $row['id'], $rows);
$imagesByWork = [];

if ($workIds) {
    try {
        $placeholders = implode(',', array_fill(0, count($workIds), '?'));
        $imageStmt = db()->prepare(
            "SELECT id, work_id, image_url, alt, display_order, is_cover
             FROM featured_work_images
             WHERE work_id IN ($placeholders)
             ORDER BY is_cover DESC, display_order ASC, id ASC"
        );
        $imageStmt->execute($workIds);

        foreach ($imageStmt->fetchAll() as $image) {
            $workId = (int) $image['work_id'];
            $imagesByWork[$workId][] = [
                'id' => (int) $image['id'],
                'image' => $image['image_url'],
                'alt' => $image['alt'],
                'isCover' => (bool) $image['is_cover'],
            ];
        }
    } catch (Throwable) {
        $imagesByWork = [];
    }
}

$works = array_map(static function (array $row) use ($imagesByWork): array {
    $images = $imagesByWork[(int) $row['id']] ?? [];

    if (!$images) {
        $images = [[
            'id' => 0,
            'image' => $row['image_url'],
            'alt' => $row['alt'],
            'isCover' => true,
        ]];
    }

    return [
        'id' => (int) $row['id'],
        'title' => $row['title'],
        'meta' => $row['meta'],
        'description' => $row['description'],
        'image' => $row['image_url'],
        'alt' => $row['alt'],
        'layout' => $row['layout'],
        'className' => 'project-card project-card-' . $row['layout'],
        'images' => $images,
    ];
}, $rows);

send_json(['data' => $works]);
