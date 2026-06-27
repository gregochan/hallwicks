<?php

require_once __DIR__ . '/config.php';

function start_admin_session(): void
{
    if (session_status() === PHP_SESSION_NONE) {
        session_name('hallwicks_admin');
        session_start();
    }
}

function is_admin_logged_in(): bool
{
    start_admin_session();
    return !empty($_SESSION['admin_logged_in']);
}

function require_admin(): void
{
    if (!is_admin_logged_in()) {
        header('Location: login.php');
        exit;
    }
}

function verify_admin_login(string $username, string $password): bool
{
    $admin = app_config()['admin'];

    return hash_equals($admin['username'], $username)
        && password_verify($password, $admin['password_hash']);
}

function login_admin(): void
{
    start_admin_session();
    session_regenerate_id(true);
    $_SESSION['admin_logged_in'] = true;
}

function logout_admin(): void
{
    start_admin_session();
    $_SESSION = [];
    session_destroy();
}

function csrf_token(): string
{
    start_admin_session();

    if (empty($_SESSION['csrf_token'])) {
        $_SESSION['csrf_token'] = bin2hex(random_bytes(32));
    }

    return $_SESSION['csrf_token'];
}

function require_csrf(): void
{
    start_admin_session();
    $submitted = $_POST['csrf_token'] ?? '';

    if (!$submitted || !hash_equals($_SESSION['csrf_token'] ?? '', $submitted)) {
        http_response_code(403);
        exit('Invalid request token.');
    }
}
