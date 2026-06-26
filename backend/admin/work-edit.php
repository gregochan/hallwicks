<?php

require_once __DIR__ . '/../includes/auth.php';
require_once __DIR__ . '/../includes/db.php';
require_once __DIR__ . '/../includes/image.php';

require_admin();

$id = (int) ($_GET['id'] ?? 0);
$error = '';
$layouts = ['large', 'tall', 'square', 'wide', 'small'];

$work = [
    'title' => '',
    'meta' => '',
    'description' => '',
    'image_url' => '',
    'alt' => '',
    'layout' => 'small',
    'display_order' => 0,
    'published' => 1,
];

if ($id) {
    $stmt = db()->prepare('SELECT * FROM featured_works WHERE id = ?');
    $stmt->execute([$id]);
    $found = $stmt->fetch();

    if (!$found) {
        http_response_code(404);
        exit('Work not found.');
    }

    $work = $found;
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    require_csrf();

    $work = [
        'title' => trim($_POST['title'] ?? ''),
        'meta' => trim($_POST['meta'] ?? ''),
        'description' => trim($_POST['description'] ?? ''),
        'image_url' => trim($_POST['current_image_url'] ?? ''),
        'alt' => trim($_POST['alt'] ?? ''),
        'layout' => in_array($_POST['layout'] ?? '', $layouts, true) ? $_POST['layout'] : 'small',
        'display_order' => (int) ($_POST['display_order'] ?? 0),
        'published' => !empty($_POST['published']) ? 1 : 0,
    ];

    try {
        if (!$work['title'] || !$work['meta'] || !$work['alt']) {
            throw new RuntimeException('Title, meta, and alt text are required.');
        }

        if (!empty($_FILES['image']['name'])) {
            $work['image_url'] = process_featured_work_image($_FILES['image'], $work['title']);
        }

        if (!$work['image_url']) {
            throw new RuntimeException('Image is required.');
        }

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
        }

        header('Location: /admin/works.php');
        exit;
    } catch (Throwable $exception) {
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
  <link rel="stylesheet" href="/admin/styles.css">
</head>
<body>
  <header class="topbar">
    <a href="/admin/works.php" class="brand">Hallwicks</a>
    <nav>
      <a href="/admin/works.php">Works</a>
      <a href="/admin/logout.php">Logout</a>
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
      <input type="hidden" name="current_image_url" value="<?= htmlspecialchars($work['image_url']) ?>">

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
      <label>
        Image <?= $id ? '(leave blank to keep current)' : '' ?>
        <input name="image" type="file" accept="image/jpeg,image/png,image/webp" <?= $id ? '' : 'required' ?>>
      </label>
      <?php if ($work['image_url']): ?>
        <img class="preview" src="<?= htmlspecialchars($work['image_url']) ?>" alt="">
      <?php endif; ?>
      <div class="form-actions">
        <button type="submit">Save work</button>
        <a href="/admin/works.php">Cancel</a>
      </div>
    </form>
  </main>
</body>
</html>
