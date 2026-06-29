<?php

require_once __DIR__ . '/../includes/auth.php';
require_once __DIR__ . '/../includes/db.php';
require_once __DIR__ . '/../includes/image.php';

require_admin();

$id = (int) ($_GET['id'] ?? 0);
$error = '';
$logoSizes = ['wide', 'mark'];
$cropOptions = [
    'preserve' => 'Preserve original ratio',
    'square' => 'Square crop',
    'wide' => 'Wide 16:9',
];

$client = [
    'name' => '',
    'image_url' => '',
    'alt' => '',
    'logo_size' => 'wide',
    'display_order' => 0,
    'published' => 1,
];
$processing = image_processing_options([]);

if ($id) {
    $stmt = db()->prepare('SELECT * FROM client_logos WHERE id = ?');
    $stmt->execute([$id]);
    $found = $stmt->fetch();

    if (!$found) {
        http_response_code(404);
        exit('Client logo not found.');
    }

    $client = $found;
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    require_csrf();
    $processing = image_processing_options($_POST);

    $client = [
        'name' => trim($_POST['name'] ?? ''),
        'image_url' => trim($_POST['existing_image_url'] ?? ''),
        'alt' => trim($_POST['alt'] ?? ''),
        'logo_size' => in_array($_POST['logo_size'] ?? '', $logoSizes, true) ? $_POST['logo_size'] : 'wide',
        'display_order' => (int) ($_POST['display_order'] ?? 0),
        'published' => !empty($_POST['published']) ? 1 : 0,
    ];

    try {
        if (!$client['name'] || !$client['alt']) {
            throw new RuntimeException('Name and alt text are required.');
        }

        $oldImageUrl = '';

        if ($id) {
            $oldStmt = db()->prepare('SELECT image_url FROM client_logos WHERE id = ?');
            $oldStmt->execute([$id]);
            $oldImageUrl = (string) $oldStmt->fetchColumn();
        }

        if (!empty($_FILES['image']) && ($_FILES['image']['error'] ?? UPLOAD_ERR_NO_FILE) !== UPLOAD_ERR_NO_FILE) {
            $client['image_url'] = process_client_logo_image($_FILES['image'], $client['name'], $_POST);
        }

        if (!$client['image_url']) {
            throw new RuntimeException('A logo image is required.');
        }

        if ($id) {
            $stmt = db()->prepare(
                'UPDATE client_logos
                 SET name = :name, image_url = :image_url, alt = :alt, logo_size = :logo_size,
                     display_order = :display_order, published = :published
                 WHERE id = :id'
            );
            $stmt->execute([
                ':id' => $id,
                ':name' => $client['name'],
                ':image_url' => $client['image_url'],
                ':alt' => $client['alt'],
                ':logo_size' => $client['logo_size'],
                ':display_order' => $client['display_order'],
                ':published' => $client['published'],
            ]);
        } else {
            $stmt = db()->prepare(
                'INSERT INTO client_logos
                 (name, image_url, alt, logo_size, display_order, published, source)
                 VALUES
                 (:name, :image_url, :alt, :logo_size, :display_order, :published, "admin")'
            );
            $stmt->execute([
                ':name' => $client['name'],
                ':image_url' => $client['image_url'],
                ':alt' => $client['alt'],
                ':logo_size' => $client['logo_size'],
                ':display_order' => $client['display_order'],
                ':published' => $client['published'],
            ]);
        }

        if ($oldImageUrl && $oldImageUrl !== $client['image_url']) {
            delete_public_client_image($oldImageUrl);
        }

        header('Location: clients.php');
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
  <title><?= $id ? 'Edit' : 'Add' ?> Client Logo | Hallwicks Admin</title>
  <link rel="stylesheet" href="/backend/admin/styles.css?v=20260629">
</head>
<body>
  <header class="topbar">
    <a href="index.php" class="brand">Hallwicks</a>
    <nav>
      <a href="clients.php">Client logos</a>
      <a href="works.php">Works</a>
      <a href="logout.php">Logout</a>
    </nav>
  </header>
  <main class="shell narrow">
    <div class="page-head">
      <div>
        <p class="eyebrow"><?= $id ? 'Edit logo' : 'New logo' ?></p>
        <h1><?= $id ? htmlspecialchars($client['name']) : 'Add Client Logo' ?></h1>
      </div>
    </div>

    <?php if ($error): ?><div class="notice error"><?= htmlspecialchars($error) ?></div><?php endif; ?>

    <form method="post" enctype="multipart/form-data" class="editor-form">
      <input type="hidden" name="csrf_token" value="<?= htmlspecialchars(csrf_token()) ?>">
      <input type="hidden" name="existing_image_url" value="<?= htmlspecialchars($client['image_url']) ?>">
      <label>
        Name
        <input name="name" value="<?= htmlspecialchars($client['name']) ?>" required>
      </label>
      <label>
        Alt text
        <input name="alt" value="<?= htmlspecialchars($client['alt']) ?>" required>
      </label>
      <div class="form-grid">
        <label>
          Logo size
          <select name="logo_size">
            <?php foreach ($logoSizes as $size): ?>
              <option value="<?= $size ?>" <?= $client['logo_size'] === $size ? 'selected' : '' ?>><?= ucfirst($size) ?></option>
            <?php endforeach; ?>
          </select>
        </label>
        <label>
          Display order
          <input name="display_order" type="number" value="<?= (int) $client['display_order'] ?>">
        </label>
      </div>
      <label class="checkbox">
        <input name="published" type="checkbox" value="1" <?= !empty($client['published']) ? 'checked' : '' ?>>
        Published
      </label>
      <?php if ($client['image_url']): ?>
        <img class="preview logo-preview" src="<?= htmlspecialchars($client['image_url']) ?>" alt="">
      <?php endif; ?>
      <section class="editor-panel">
        <div>
          <p class="eyebrow">Upload</p>
          <h2>Logo image</h2>
        </div>
        <label>
          <?= $id ? 'Replace image' : 'Image' ?>
          <input name="image" type="file" accept="image/jpeg,image/png,image/webp" <?= $id ? '' : 'required' ?>>
        </label>
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
            Brightness
            <input name="brightness" type="range" min="-35" max="35" value="<?= (int) $processing['brightness'] ?>">
          </label>
          <label>
            Contrast
            <input name="contrast" type="range" min="-35" max="35" value="<?= (int) $processing['contrast'] ?>">
          </label>
        </div>
      </section>
      <div class="form-actions">
        <button type="submit">Save logo</button>
        <a href="clients.php">Cancel</a>
      </div>
    </form>
  </main>
</body>
</html>
