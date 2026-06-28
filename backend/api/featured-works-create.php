<?php

require_once __DIR__ . '/../includes/config.php';
require_once __DIR__ . '/../includes/db.php';
require_once __DIR__ . '/../includes/image.php';
require_once __DIR__ . '/../includes/response.php';

require_method('POST');

$expectedToken = app_config()['api']['write_token'] ?? '';
$providedToken = $_SERVER['HTTP_X_API_TOKEN'] ?? ($_POST['api_token'] ?? '');

if (!$expectedToken || !hash_equals($expectedToken, $providedToken)) {
    send_json(['error' => 'Unauthorized'], 401);
}

$title = trim($_POST['title'] ?? '');
$meta = trim($_POST['meta'] ?? '');
$description = trim($_POST['description'] ?? '');
$alt = trim($_POST['alt'] ?? $title);
$layout = $_POST['layout'] ?? 'small';
$order = (int) ($_POST['display_order'] ?? 0);
$published = (int) ($_POST['published'] ?? 0);
$source = $_POST['source'] ?? 'api';
$coverIndex = max(0, (int) ($_POST['cover_index'] ?? 0));
$validLayouts = ['large', 'tall', 'square', 'wide', 'small'];
$validSources = ['admin', 'telegram', 'whatsapp', 'api'];

if (!$title || !$meta || !$alt) {
    send_json(['error' => 'Missing required fields'], 422);
}

if (!in_array($layout, $validLayouts, true)) {
    $layout = 'small';
}

if (!in_array($source, $validSources, true)) {
    $source = 'api';
}

try {
    $uploads = [];

    if (!empty($_FILES['images'])) {
        $uploads = uploaded_files_from_field($_FILES['images']);
    }

    if (!$uploads && !empty($_FILES['image'])) {
        $uploads = uploaded_files_from_field($_FILES['image']);
    }

    if (!$uploads) {
        send_json(['error' => 'Image is required'], 422);
    }

    $imageUrls = [];

    foreach ($uploads as $index => $upload) {
        $imageUrls[] = process_featured_work_image($upload, $title, $_POST);
    }

    $coverIndex = min($coverIndex, count($imageUrls) - 1);
    $imageUrl = $imageUrls[$coverIndex];

    $stmt = db()->prepare(
        "INSERT INTO featured_works
         (title, meta, description, image_url, alt, layout, display_order, published, source)
         VALUES
         (:title, :meta, :description, :image_url, :alt, :layout, :display_order, :published, :source)"
    );

    $stmt->execute([
        ':title' => $title,
        ':meta' => $meta,
        ':description' => $description ?: null,
        ':image_url' => $imageUrl,
        ':alt' => $alt,
        ':layout' => $layout,
        ':display_order' => $order,
        ':published' => $published ? 1 : 0,
        ':source' => $source,
    ]);

    $workId = (int) db()->lastInsertId();

    try {
        $imageStmt = db()->prepare(
            "INSERT INTO featured_work_images
             (work_id, image_url, alt, display_order, is_cover)
             VALUES
             (:work_id, :image_url, :alt, :display_order, :is_cover)"
        );

        foreach ($imageUrls as $index => $url) {
            $imageStmt->execute([
                ':work_id' => $workId,
                ':image_url' => $url,
                ':alt' => $alt,
                ':display_order' => $index,
                ':is_cover' => $index === $coverIndex ? 1 : 0,
            ]);
        }
    } catch (Throwable) {
        // Gallery table may not exist until the migration is imported.
    }

    send_json(['data' => ['id' => $workId, 'image' => $imageUrl, 'images' => $imageUrls]], 201);
} catch (Throwable $error) {
    send_json(['error' => $error->getMessage()], 500);
}
