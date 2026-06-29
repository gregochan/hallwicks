<?php

require_once __DIR__ . '/../includes/auth.php';
require_once __DIR__ . '/../includes/db.php';
require_once __DIR__ . '/../includes/image.php';

require_admin();

$id = (int) ($_GET['id'] ?? $_POST['id'] ?? 0);

if (!$id) {
    http_response_code(404);
    exit('Client logo not found.');
}

$stmt = db()->prepare('SELECT * FROM client_logos WHERE id = ?');
$stmt->execute([$id]);
$client = $stmt->fetch();

if (!$client) {
    http_response_code(404);
    exit('Client logo not found.');
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    require_csrf();

    db()->prepare('DELETE FROM client_logos WHERE id = ?')->execute([$id]);
    delete_public_client_image($client['image_url']);

    header('Location: clients.php');
    exit;
}
?>
<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Delete Client Logo | Hallwicks Admin</title>
  <link rel="stylesheet" href="/backend/admin/styles.css?v=20260629">
</head>
<body>
  <header class="topbar">
    <a href="index.php" class="brand">Hallwicks</a>
    <nav>
      <a href="clients.php">Client logos</a>
      <a href="logout.php">Logout</a>
    </nav>
  </header>
  <main class="shell narrow">
    <div class="page-head">
      <div>
        <p class="eyebrow">Delete logo</p>
        <h1><?= htmlspecialchars($client['name']) ?></h1>
      </div>
    </div>
    <div class="notice error">This will remove the logo record and uploaded image.</div>
    <form method="post" class="form-actions">
      <input type="hidden" name="csrf_token" value="<?= htmlspecialchars(csrf_token()) ?>">
      <input type="hidden" name="id" value="<?= (int) $client['id'] ?>">
      <button class="danger-button" type="submit">Delete logo</button>
      <a href="clients.php">Cancel</a>
    </form>
  </main>
</body>
</html>
