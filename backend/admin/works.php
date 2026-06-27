<?php

require_once __DIR__ . '/../includes/auth.php';
require_once __DIR__ . '/../includes/db.php';

require_admin();

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    require_csrf();
    $action = $_POST['action'] ?? '';
    $id = (int) ($_POST['toggle_id'] ?? 0);

    if ($action === 'toggle' && $id) {
        db()->prepare('UPDATE featured_works SET published = 1 - published WHERE id = ?')->execute([$id]);
    }

    if ($action === 'order' && !empty($_POST['order']) && is_array($_POST['order'])) {
        $stmt = db()->prepare('UPDATE featured_works SET display_order = ? WHERE id = ?');

        foreach ($_POST['order'] as $workId => $order) {
            $stmt->execute([(int) $order, (int) $workId]);
        }
    }

    header('Location: works.php');
    exit;
}

$works = db()->query(
    'SELECT id, title, meta, image_url, layout, display_order, published, source, updated_at
     FROM featured_works
     ORDER BY display_order ASC, title ASC'
)->fetchAll();
?>
<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Featured Works | Hallwicks Admin</title>
  <link rel="stylesheet" href="/backend/admin/styles.css?v=20260627">
</head>
<body>
  <header class="topbar">
    <a href="works.php" class="brand">Hallwicks</a>
    <nav>
      <a href="work-edit.php">Add work</a>
      <a href="logout.php">Logout</a>
    </nav>
  </header>
  <main class="shell">
    <div class="page-head">
      <div>
        <p class="eyebrow">Featured Works</p>
        <h1>Project editor</h1>
      </div>
      <a class="button" href="work-edit.php">Add work</a>
    </div>

    <form method="post" class="table-form">
      <input type="hidden" name="csrf_token" value="<?= htmlspecialchars(csrf_token()) ?>">
      <input type="hidden" name="action" value="order">
      <div class="work-list">
        <?php if (!$works): ?>
          <div class="empty-state">
            <h2>No projects yet</h2>
            <p>Add your first featured work to test the API and image upload flow.</p>
            <a class="button" href="work-edit.php">Add work</a>
          </div>
        <?php endif; ?>
        <?php foreach ($works as $work): ?>
          <article class="work-row">
            <img src="<?= htmlspecialchars($work['image_url']) ?>" alt="">
            <div>
              <h2><?= htmlspecialchars($work['title']) ?></h2>
              <p><?= htmlspecialchars($work['meta']) ?></p>
              <small><?= htmlspecialchars($work['layout']) ?> · <?= $work['published'] ? 'Published' : 'Draft' ?> · <?= htmlspecialchars($work['source']) ?></small>
            </div>
            <label>
              Order
              <input type="number" name="order[<?= (int) $work['id'] ?>]" value="<?= (int) $work['display_order'] ?>">
            </label>
            <div class="actions">
              <a href="work-edit.php?id=<?= (int) $work['id'] ?>">Edit</a>
              <button type="submit" formaction="works.php" name="toggle_id" value="<?= (int) $work['id'] ?>" onclick="this.form.elements.action.value='toggle'">
                <?= $work['published'] ? 'Unpublish' : 'Publish' ?>
              </button>
              <a class="danger" href="work-delete.php?id=<?= (int) $work['id'] ?>">Delete</a>
            </div>
          </article>
        <?php endforeach; ?>
      </div>
      <button type="submit" class="button secondary">Save order</button>
    </form>
  </main>
</body>
</html>
