<?php

require_once __DIR__ . '/../includes/auth.php';
require_once __DIR__ . '/../includes/db.php';

require_admin();

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    require_csrf();
    $action = $_POST['action'] ?? '';
    $id = (int) ($_POST['toggle_id'] ?? 0);

    if ($action === 'toggle' && $id) {
        db()->prepare('UPDATE client_logos SET published = 1 - published WHERE id = ?')->execute([$id]);
    }

    if ($action === 'order' && !empty($_POST['sorted_ids']) && is_array($_POST['sorted_ids'])) {
        $stmt = db()->prepare('UPDATE client_logos SET display_order = ? WHERE id = ?');

        foreach (array_values($_POST['sorted_ids']) as $index => $clientId) {
            $stmt->execute([$index + 1, (int) $clientId]);
        }
    } elseif ($action === 'order' && !empty($_POST['order']) && is_array($_POST['order'])) {
        $stmt = db()->prepare('UPDATE client_logos SET display_order = ? WHERE id = ?');

        foreach ($_POST['order'] as $clientId => $order) {
            $stmt->execute([(int) $order, (int) $clientId]);
        }
    }

    header('Location: clients.php');
    exit;
}

$clients = db()->query(
    'SELECT id, name, image_url, logo_size, display_order, published, source, updated_at
     FROM client_logos
     ORDER BY display_order ASC, name ASC'
)->fetchAll();
?>
<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Client Logos | Hallwicks Admin</title>
  <link rel="stylesheet" href="/backend/admin/styles.css?v=20260629">
  <script src="/backend/admin/sortable.js?v=20260629" defer></script>
</head>
<body>
  <header class="topbar">
    <a href="index.php" class="brand">Hallwicks</a>
    <nav>
      <a href="index.php">Dashboard</a>
      <a href="works.php">Works</a>
      <a href="client-edit.php">Add logo</a>
      <a href="logout.php">Logout</a>
    </nav>
  </header>
  <main class="shell">
    <div class="page-head">
      <div>
        <p class="eyebrow">Client Logos</p>
        <h1>Logo wall editor</h1>
      </div>
      <a class="button" href="client-edit.php">Add logo</a>
    </div>

    <form method="post" class="table-form">
      <input type="hidden" name="csrf_token" value="<?= htmlspecialchars(csrf_token()) ?>">
      <input type="hidden" name="action" value="order">
      <div class="work-list sortable-list" data-sortable-list>
        <?php if (!$clients): ?>
          <div class="empty-state">
            <h2>No client logos yet</h2>
            <p>Add your first client logo to test the API and upload flow.</p>
            <a class="button" href="client-edit.php">Add logo</a>
          </div>
        <?php endif; ?>
        <?php foreach ($clients as $client): ?>
          <article class="work-row logo-row sortable-row" draggable="true" data-sortable-row>
            <input type="hidden" name="sorted_ids[]" value="<?= (int) $client['id'] ?>">
            <button class="drag-handle" type="button" aria-label="Drag <?= htmlspecialchars($client['name']) ?>">↕</button>
            <img src="<?= htmlspecialchars($client['image_url']) ?>" alt="">
            <div>
              <h2><?= htmlspecialchars($client['name']) ?></h2>
              <p><?= htmlspecialchars($client['logo_size']) ?></p>
              <small><?= $client['published'] ? 'Published' : 'Draft' ?> · <?= htmlspecialchars($client['source']) ?></small>
            </div>
            <div class="order-badge" data-sortable-position><?= (int) $client['display_order'] ?></div>
            <div class="actions">
              <a href="client-edit.php?id=<?= (int) $client['id'] ?>">Edit</a>
              <button type="submit" formaction="clients.php" name="toggle_id" value="<?= (int) $client['id'] ?>" onclick="this.form.elements.action.value='toggle'">
                <?= $client['published'] ? 'Unpublish' : 'Publish' ?>
              </button>
              <a class="danger" href="client-delete.php?id=<?= (int) $client['id'] ?>">Delete</a>
            </div>
          </article>
        <?php endforeach; ?>
      </div>
      <button type="submit" class="button secondary">Save order</button>
    </form>
  </main>
</body>
</html>
