<?php

require_once __DIR__ . '/config.php';

function send_json(array $payload, int $status = 200): void
{
    $origin = $_SERVER['HTTP_ORIGIN'] ?? '';
    $allowed = app_config()['api']['allowed_origins'] ?? [];

    if ($origin && in_array($origin, $allowed, true)) {
        header('Access-Control-Allow-Origin: ' . $origin);
        header('Vary: Origin');
    }

    header('Content-Type: application/json; charset=utf-8');
    header('Cache-Control: no-store');
    http_response_code($status);
    echo json_encode($payload, JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE);
    exit;
}

function require_method(string $method): void
{
    if ($_SERVER['REQUEST_METHOD'] !== $method) {
        send_json(['error' => 'Method not allowed'], 405);
    }
}
