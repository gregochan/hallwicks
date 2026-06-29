<?php

require_once __DIR__ . '/../includes/auth.php';
require_once __DIR__ . '/../includes/db.php';
require_once __DIR__ . '/../includes/image.php';

require_admin();

$id = (int) ($_GET['id'] ?? 0);
$error = '';
$layouts = ['large', 'tall', 'square', 'wide', 'small'];
$cropOptions = [
    'preserve' => 'Preserve original ratio',
    'square' => 'Square crop',
    'landscape' => 'Landscape 4:3',
    'wide' => 'Wide 16:9',
    'portrait' => 'Portrait 3:4',
];

$work = [
    'title' => '',
    'meta' => '',
    'description' => '',
    'image_url' => '',
    'alt' => '',
    'layout' => 'small',
    'display_order' => 1,
    'published' => 1,
];
$images = [];
$processing = image_processing_options([]);

if ($id) {
    $stmt = db()->prepare('SELECT * FROM featured_works WHERE id = ?');
    $stmt->execute([$id]);
    $found = $stmt->fetch();

    if (!$found) {
        http_response_code(404);
        exit('Work not found.');
    }

    $work = $found;

    try {
        $imageStmt = db()->prepare(
            'SELECT id, image_url, alt, display_order, is_cover
             FROM featured_work_images
             WHERE work_id = ?
             ORDER BY is_cover DESC, display_order ASC, id ASC'
        );
        $imageStmt->execute([$id]);
        $images = $imageStmt->fetchAll();
    } catch (Throwable) {
        $images = [];
    }

    if (!$images && !empty($work['image_url'])) {
        $images = [[
            'id' => 0,
            'image_url' => $work['image_url'],
            'alt' => $work['alt'],
            'display_order' => 0,
            'is_cover' => 1,
        ]];
    }
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    require_csrf();
    $processing = image_processing_options($_POST);
    $oldImageUrls = [];

    if ($id) {
        try {
            $oldImageStmt = db()->prepare('SELECT image_url FROM featured_work_images WHERE work_id = ?');
            $oldImageStmt->execute([$id]);
            $oldImageUrls = array_map(static fn (array $image): string => $image['image_url'], $oldImageStmt->fetchAll());
        } catch (Throwable) {
            $oldImageUrls = !empty($work['image_url']) ? [$work['image_url']] : [];
        }
    }

    $work = [
        'title' => trim($_POST['title'] ?? ''),
        'meta' => trim($_POST['meta'] ?? ''),
        'description' => trim($_POST['description'] ?? ''),
        'image_url' => '',
        'alt' => trim($_POST['alt'] ?? ''),
        'layout' => in_array($_POST['layout'] ?? '', $layouts, true) ? $_POST['layout'] : 'small',
        'display_order' => (int) ($_POST['display_order'] ?? 0),
        'published' => !empty($_POST['published']) ? 1 : 0,
    ];

    try {
        if (!$work['title'] || !$work['meta'] || !$work['alt']) {
            throw new RuntimeException('Title, meta, and alt text are required.');
        }

        $galleryImages = [];
        $existingIds = $_POST['existing_image_id'] ?? [];
        $existingUrls = $_POST['existing_image_url'] ?? [];
        $existingAlts = $_POST['existing_image_alt'] ?? [];
        $existingOrders = $_POST['existing_image_order'] ?? [];
        $deleted = array_flip($_POST['delete_image'] ?? []);

        foreach ($existingUrls as $index => $url) {
            $imageId = (int) ($existingIds[$index] ?? 0);

            if (isset($deleted[(string) $imageId])) {
                continue;
            }

            $url = trim($url);

            if (!$url) {
                continue;
            }

            $galleryImages[] = [
                'key' => 'existing-' . $imageId,
                'url' => $url,
                'alt' => trim($existingAlts[$index] ?? '') ?: $work['alt'],
                'order' => (int) ($existingOrders[$index] ?? $index),
            ];
        }

        $uploads = [];

        if (!empty($_FILES['images'])) {
            $uploads = uploaded_files_from_field($_FILES['images']);
        }

        if (!$uploads && !empty($_FILES['image'])) {
            $uploads = uploaded_files_from_field($_FILES['image']);
        }

        $newAlt = trim($_POST['new_image_alt'] ?? '') ?: $work['alt'];

        foreach ($uploads as $index => $upload) {
            $galleryImages[] = [
                'key' => 'new-' . $index,
                'url' => process_featured_work_image($upload, $work['title'], $_POST),
                'alt' => $newAlt,
                'order' => count($galleryImages),
            ];
        }

        usort($galleryImages, static fn (array $a, array $b): int => $a['order'] <=> $b['order']);

        if (!$galleryImages) {
            throw new RuntimeException('At least one image is required.');
        }

        $coverKey = $_POST['cover_image'] ?? $galleryImages[0]['key'];
        $coverImage = $galleryImages[0];

        foreach ($galleryImages as $image) {
            if ($image['key'] === $coverKey) {
                $coverImage = $image;
                break;
            }
        }

        $work['image_url'] = $coverImage['url'];

        db()->beginTransaction();

        if ($id) {
            $stmt = db()->prepare(
                'UPDATE featured_works
                 SET title = :title, meta = :meta, description = :description, image_url = :image_url,
                     alt = :alt, layout = :layout, display_order = :display_order, published = :published
                 WHERE id = :id'
            );
            $stmt->execute([
                ':id' => $id,
                ':title' => $work['title'],
                ':meta' => $work['meta'],
                ':description' => $work['description'] ?: null,
                ':image_url' => $work['image_url'],
                ':alt' => $work['alt'],
                ':layout' => $work['layout'],
                ':display_order' => $work['display_order'],
                ':published' => $work['published'],
            ]);
        } else {
            if ($work['display_order'] <= 0) {
                $work['display_order'] = 1;
            }

            db()->prepare('UPDATE featured_works SET display_order = display_order + 1 WHERE display_order >= ?')
                ->execute([$work['display_order']]);

            $stmt = db()->prepare(
                'INSERT INTO featured_works
                 (title, meta, description, image_url, alt, layout, display_order, published, source)
                 VALUES
                 (:title, :meta, :description, :image_url, :alt, :layout, :display_order, :published, "admin")'
            );
            $stmt->execute([
                ':title' => $work['title'],
                ':meta' => $work['meta'],
                ':description' => $work['description'] ?: null,
                ':image_url' => $work['image_url'],
                ':alt' => $work['alt'],
                ':layout' => $work['layout'],
                ':display_order' => $work['display_order'],
                ':published' => $work['published'],
            ]);

            $id = (int) db()->lastInsertId();
        }

        db()->prepare('DELETE FROM featured_work_images WHERE work_id = ?')->execute([$id]);
        $imageStmt = db()->prepare(
            'INSERT INTO featured_work_images
             (work_id, image_url, alt, display_order, is_cover)
             VALUES
             (:work_id, :image_url, :alt, :display_order, :is_cover)'
        );

        foreach (array_values($galleryImages) as $index => $image) {
            $imageStmt->execute([
                ':work_id' => $id,
                ':image_url' => $image['url'],
                ':alt' => $image['alt'],
                ':display_order' => $index,
                ':is_cover' => $image['url'] === $coverImage['url'] ? 1 : 0,
            ]);
        }

        db()->commit();

        $keptUrls = array_flip(array_map(static fn (array $image): string => $image['url'], $galleryImages));

        foreach ($oldImageUrls as $oldUrl) {
            if (!isset($keptUrls[$oldUrl])) {
                delete_public_work_image($oldUrl);
            }
        }

        header('Location: works.php');
        exit;
    } catch (Throwable $exception) {
        if (db()->inTransaction()) {
            db()->rollBack();
        }

        $error = $exception->getMessage();
    }
}
?>
<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title><?= $id ? 'Edit' : 'Add' ?> Featured Work | Hallwicks Admin</title>
  <link rel="stylesheet" href="/backend/admin/styles.css?v=20260628">
</head>
<body>
  <header class="topbar">
    <a href="index.php" class="brand">Hallwicks</a>
    <nav>
      <a href="index.php">Dashboard</a>
      <a href="works.php">Works</a>
      <a href="clients.php">Client logos</a>
      <a href="logout.php">Logout</a>
    </nav>
  </header>
  <main class="shell narrow">
    <div class="page-head">
      <div>
        <p class="eyebrow"><?= $id ? 'Edit work' : 'New work' ?></p>
        <h1><?= $id ? htmlspecialchars($work['title']) : 'Add Featured Work' ?></h1>
      </div>
    </div>

    <?php if ($error): ?><div class="notice error"><?= htmlspecialchars($error) ?></div><?php endif; ?>

    <form method="post" enctype="multipart/form-data" class="editor-form">
      <input type="hidden" name="csrf_token" value="<?= htmlspecialchars(csrf_token()) ?>">
      <label>
        Title
        <input name="title" value="<?= htmlspecialchars($work['title']) ?>" required>
      </label>
      <label>
        Meta
        <input name="meta" value="<?= htmlspecialchars($work['meta']) ?>" required placeholder="Hong Kong // Dental Clinic // 2026">
      </label>
      <label>
        Description
        <textarea name="description" rows="4"><?= htmlspecialchars($work['description'] ?? '') ?></textarea>
      </label>
      <label>
        Alt text
        <input name="alt" value="<?= htmlspecialchars($work['alt']) ?>" required>
      </label>
      <div class="form-grid">
        <label>
          Layout
          <select name="layout">
            <?php foreach ($layouts as $layout): ?>
              <option value="<?= $layout ?>" <?= $work['layout'] === $layout ? 'selected' : '' ?>><?= ucfirst($layout) ?></option>
            <?php endforeach; ?>
          </select>
        </label>
        <label>
          Display order
          <input name="display_order" type="number" value="<?= (int) $work['display_order'] ?>">
        </label>
      </div>
      <label class="checkbox">
        <input name="published" type="checkbox" value="1" <?= !empty($work['published']) ? 'checked' : '' ?>>
        Published
      </label>
      <section class="editor-panel">
        <div>
          <p class="eyebrow">Gallery</p>
          <h2>Project images</h2>
        </div>
        <?php if ($images): ?>
          <div class="image-editor-grid">
            <?php foreach ($images as $image): ?>
              <article class="image-editor-card">
                <img src="<?= htmlspecialchars($image['image_url']) ?>" alt="">
                <input type="hidden" name="existing_image_id[]" value="<?= (int) $image['id'] ?>">
                <input type="hidden" name="existing_image_url[]" value="<?= htmlspecialchars($image['image_url']) ?>">
                <label class="radio-row">
                  <input name="cover_image" type="radio" value="existing-<?= (int) $image['id'] ?>" <?= !empty($image['is_cover']) ? 'checked' : '' ?>>
                  Cover
                </label>
                <label>
                  Alt text
                  <input name="existing_image_alt[]" value="<?= htmlspecialchars($image['alt']) ?>">
                </label>
                <label>
                  Order
                  <input name="existing_image_order[]" type="number" value="<?= (int) $image['display_order'] ?>">
                </label>
                <label class="checkbox">
                  <input name="delete_image[]" type="checkbox" value="<?= (int) $image['id'] ?>">
                  Delete
                </label>
              </article>
            <?php endforeach; ?>
          </div>
        <?php endif; ?>
        <label>
          Add images <?= $id ? '(optional)' : '' ?>
          <input name="images[]" type="file" accept="image/jpeg,image/png,image/webp" multiple <?= $id ? '' : 'required' ?>>
        </label>
        <label>
          Alt text for new images
          <input name="new_image_alt" value="<?= htmlspecialchars($work['alt']) ?>">
        </label>
      </section>
      <section class="editor-panel">
        <div>
          <p class="eyebrow">Processing</p>
          <h2>New image adjustments</h2>
        </div>
        <div class="form-grid">
          <label>
            Crop
            <select name="crop">
              <?php foreach ($cropOptions as $value => $label): ?>
                <option value="<?= $value ?>" <?= $processing['crop'] === $value ? 'selected' : '' ?>><?= $label ?></option>
              <?php endforeach; ?>
            </select>
          </label>
          <label>
            Rotate
            <select name="rotate">
              <?php foreach ([0, 90, 180, 270] as $rotation): ?>
                <option value="<?= $rotation ?>" <?= $processing['rotate'] === $rotation ? 'selected' : '' ?>><?= $rotation ?>°</option>
              <?php endforeach; ?>
            </select>
          </label>
          <label>
            Horizontal alignment
            <select name="align_x">
              <?php foreach (['left' => 'Left', 'center' => 'Center', 'right' => 'Right'] as $value => $label): ?>
                <option value="<?= $value ?>" <?= $processing['align_x'] === $value ? 'selected' : '' ?>><?= $label ?></option>
              <?php endforeach; ?>
            </select>
          </label>
          <label>
            Vertical alignment
            <select name="align_y">
              <?php foreach (['top' => 'Top', 'middle' => 'Middle', 'bottom' => 'Bottom'] as $value => $label): ?>
                <option value="<?= $value ?>" <?= $processing['align_y'] === $value ? 'selected' : '' ?>><?= $label ?></option>
              <?php endforeach; ?>
            </select>
          </label>
          <label>
            Brightness
            <input name="brightness" type="range" min="-35" max="35" value="<?= (int) $processing['brightness'] ?>">
          </label>
          <label>
            Contrast
            <input name="contrast" type="range" min="-35" max="35" value="<?= (int) $processing['contrast'] ?>">
          </label>
          <label>
            Saturation
            <input name="saturation" type="range" min="-35" max="35" value="<?= (int) $processing['saturation'] ?>">
          </label>
        </div>
      </section>
      <div class="form-actions">
        <button type="submit">Save work</button>
        <a href="works.php">Cancel</a>
      </div>
    </form>
  </main>
</body>
</html>
