<?php

require_once __DIR__ . '/../includes/auth.php';
require_once __DIR__ . '/../includes/db.php';

require_admin();

$workCount = (int) db()->query('SELECT COUNT(*) FROM featured_works')->fetchColumn();
$clientCount = 0;

try {
    $clientCount = (int) db()->query('SELECT COUNT(*) FROM client_logos')->fetchColumn();
} catch (Throwable) {
    $clientCount = 0;
}
?>
<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Dashboard | Hallwicks Admin</title>
  <link rel="stylesheet" href="/backend/admin/styles.css?v=20260629">
</head>
<body>
  <header class="topbar">
    <a href="index.php" class="brand">Hallwicks</a>
    <nav>
      <a href="works.php">Works</a>
      <a href="clients.php">Client logos</a>
      <a href="logout.php">Logout</a>
    </nav>
  </header>
  <main class="shell">
    <div class="page-head">
      <div>
        <p class="eyebrow">CMS</p>
        <h1>Content dashboard</h1>
      </div>
    </div>
    <div class="dashboard-grid">
      <a class="dashboard-card" href="works.php">
        <span>Featured works</span>
        <strong><?= $workCount ?></strong>
        <small>Edit projects, gallery images, cover image, ordering, and publish state.</small>
      </a>
      <a class="dashboard-card" href="clients.php">
        <span>Client logos</span>
        <strong><?= $clientCount ?></strong>
        <small>Edit the logo wall, upload WebP-converted logos, and control display order.</small>
      </a>
    </div>
  </main>
</body>
</html>
