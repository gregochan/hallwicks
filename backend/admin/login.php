<?php

require_once __DIR__ . '/../includes/auth.php';

$error = '';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    require_csrf();

    if (verify_admin_login(trim($_POST['username'] ?? ''), $_POST['password'] ?? '')) {
        login_admin();
        header('Location: /admin/works.php');
        exit;
    }

    $error = 'Invalid username or password.';
}

if (is_admin_logged_in()) {
    header('Location: /admin/works.php');
    exit;
}
?>
<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Hallwicks Admin Login</title>
  <link rel="stylesheet" href="/admin/styles.css">
</head>
<body class="auth-page">
  <main class="auth-card">
    <h1>Hallwicks</h1>
    <p>Featured Works editor</p>
    <?php if ($error): ?><div class="notice error"><?= htmlspecialchars($error) ?></div><?php endif; ?>
    <form method="post">
      <input type="hidden" name="csrf_token" value="<?= htmlspecialchars(csrf_token()) ?>">
      <label>
        Username
        <input name="username" autocomplete="username" required>
      </label>
      <label>
        Password
        <input name="password" type="password" autocomplete="current-password" required>
      </label>
      <button type="submit">Login</button>
    </form>
  </main>
</body>
</html>
