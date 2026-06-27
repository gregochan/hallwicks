<?php

require_once __DIR__ . '/../includes/auth.php';
require_once __DIR__ . '/../includes/db.php';

require_admin();

$id = (int) ($_GET['id'] ?? 0);

if (!$id) {
    header('Location: works.php');
    exit;
}

$stmt = db()->prepare('SELECT id, title FROM featured_works WHERE id = ?');
$stmt->execute([$id]);
$work = $stmt->fetch();

if (!$work) {
    http_response_code(404);
    exit('Work not found.');
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    require_csrf();
    db()->prepare('DELETE FROM featured_works WHERE id = ?')->execute([$id]);
    header('Location: works.php');
    exit;
}
?>
<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Delete Featured Work | Hallwicks Admin</title>
  <link rel="stylesheet" href="/backend/admin/styles.css?v=20260627">
</head>
<body>
  <main class="auth-card">
    <h1>Delete work?</h1>
    <p><?= htmlspecialchars($work['title']) ?></p>
    <form method="post">
      <input type="hidden" name="csrf_token" value="<?= htmlspecialchars(csrf_token()) ?>">
      <button class="danger-button" type="submit">Delete permanently</button>
      <a href="works.php">Cancel</a>
    </form>
  </main>
</body>
</html>
