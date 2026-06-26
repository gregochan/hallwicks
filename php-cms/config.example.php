<?php

return [
    'db' => [
        'dsn' => 'mysql:host=localhost;dbname=hallwicks;charset=utf8mb4',
        'user' => 'hallwicks_user',
        'password' => 'replace-with-database-password',
    ],
    'admin' => [
        'username' => 'admin',
        // Generate with: php -r "echo password_hash('your-password', PASSWORD_DEFAULT) . PHP_EOL;"
        'password_hash' => '$2y$10$replaceWithGeneratedPasswordHash',
    ],
    'api' => [
        // Used later by Telegram/WhatsApp automations that POST new works.
        'write_token' => 'replace-with-long-random-token',
        'allowed_origins' => [
            'http://localhost:3000',
            'https://hallwicks.com',
        ],
    ],
    'paths' => [
        'public_upload_dir' => __DIR__ . '/uploads/works/public',
        'private_upload_dir' => __DIR__ . '/uploads/works/original-private',
        'public_upload_url' => '/uploads/works/public',
    ],
    'images' => [
        'max_upload_bytes' => 12 * 1024 * 1024,
        'max_width' => 1800,
        'webp_quality' => 78,
        'watermark_text' => 'HALLWICKS',
    ],
];
