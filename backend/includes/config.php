<?php

function app_config(): array
{
    static $config = null;

    if ($config !== null) {
        return $config;
    }

    $path = dirname(__DIR__) . '/config.php';

    if (!file_exists($path)) {
        http_response_code(500);
        exit('Missing config.php. Copy config.example.php to config.php and update credentials.');
    }

    $config = require $path;

    return $config;
}
