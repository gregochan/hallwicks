<?php

require_once __DIR__ . '/config.php';

function ensure_upload_dirs(): void
{
    $paths = app_config()['paths'];
    $dir = $paths['public_upload_dir'];

    if (!is_dir($dir) && !mkdir($dir, 0755, true)) {
        throw new RuntimeException('Unable to create upload directory.');
    }
}

function uploaded_image_is_valid(array $file): void
{
    $maxBytes = app_config()['images']['max_upload_bytes'];

    if (($file['error'] ?? UPLOAD_ERR_NO_FILE) !== UPLOAD_ERR_OK) {
        throw new RuntimeException('Image upload failed.');
    }

    if (($file['size'] ?? 0) > $maxBytes) {
        throw new RuntimeException('Image is too large.');
    }

    $info = getimagesize($file['tmp_name']);
    $allowed = ['image/jpeg', 'image/png', 'image/webp'];

    if (!$info || !in_array($info['mime'], $allowed, true)) {
        throw new RuntimeException('Only JPG, PNG, and WebP images are allowed.');
    }
}

function slug_part(string $value): string
{
    $slug = strtolower(trim(preg_replace('/[^a-zA-Z0-9]+/', '-', $value), '-'));
    return $slug ?: 'work';
}

function process_featured_work_image(array $file, string $title): string
{
    ensure_upload_dirs();
    uploaded_image_is_valid($file);

    $config = app_config();
    $base = slug_part($title) . '-' . bin2hex(random_bytes(6));
    $publicPath = $config['paths']['public_upload_dir'] . '/' . $base . '.webp';
    $sourcePath = $file['tmp_name'];

    if (extension_loaded('imagick')) {
        image_to_webp_with_imagick($sourcePath, $publicPath);
    } else {
        image_to_webp_with_gd($sourcePath, $publicPath);
    }

    if (!is_file($publicPath)) {
        throw new RuntimeException('Unable to create WebP image.');
    }

    return rtrim($config['paths']['public_upload_url'], '/') . '/' . basename($publicPath);
}

function image_to_webp_with_imagick(string $source, string $destination): void
{
    $config = app_config()['images'];
    $image = new Imagick($source);
    $image->autoOrient();
    $width = $image->getImageWidth();

    if ($width > $config['max_width']) {
        $image->resizeImage($config['max_width'], 0, Imagick::FILTER_LANCZOS, 1);
    }

    $draw = new ImagickDraw();
    $draw->setFillColor(new ImagickPixel('rgba(255,255,255,0.32)'));
    $draw->setFontSize(max(18, (int) round($image->getImageWidth() / 42)));
    $draw->setGravity(Imagick::GRAVITY_SOUTHEAST);
    $image->annotateImage($draw, 34, 26, 0, $config['watermark_text']);
    $image->setImageFormat('webp');
    $image->setImageCompressionQuality((int) $config['webp_quality']);
    $image->writeImage($destination);
    $image->clear();
}

function image_to_webp_with_gd(string $source, string $destination): void
{
    $config = app_config()['images'];
    $info = getimagesize($source);

    if (!$info) {
        throw new RuntimeException('Invalid image.');
    }

    [$width, $height] = $info;
    $mime = $info['mime'];

    if ($mime === 'image/jpeg') {
        $src = imagecreatefromjpeg($source);
    } elseif ($mime === 'image/png') {
        $src = imagecreatefrompng($source);
    } elseif ($mime === 'image/webp') {
        $src = imagecreatefromwebp($source);
    } else {
        throw new RuntimeException('Unsupported image type.');
    }

    if (!$src) {
        throw new RuntimeException('Unable to read image.');
    }

    $targetWidth = min((int) $config['max_width'], $width);
    $targetHeight = (int) round($height * ($targetWidth / $width));
    $dst = imagecreatetruecolor($targetWidth, $targetHeight);
    imagealphablending($dst, true);
    imagesavealpha($dst, true);
    imagecopyresampled($dst, $src, 0, 0, 0, 0, $targetWidth, $targetHeight, $width, $height);

    $fontSize = max(4, (int) round($targetWidth / 180));
    $text = $config['watermark_text'];
    $color = imagecolorallocatealpha($dst, 255, 255, 255, 76);
    $textWidth = imagefontwidth($fontSize) * strlen($text);
    $textHeight = imagefontheight($fontSize);
    imagestring($dst, $fontSize, $targetWidth - $textWidth - 28, $targetHeight - $textHeight - 24, $text, $color);

    imagewebp($dst, $destination, (int) $config['webp_quality']);
    imagedestroy($src);
    imagedestroy($dst);
}
