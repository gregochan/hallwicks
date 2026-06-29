<?php

require_once __DIR__ . '/config.php';

function upload_bucket_paths(string $bucket = 'works'): array
{
    $paths = app_config()['paths'];

    if ($bucket === 'clients') {
        $dir = $paths['client_upload_dir'] ?? dirname(dirname($paths['public_upload_dir'])) . '/clients/public';
        $url = $paths['client_upload_url'] ?? preg_replace('#/works/public$#', '/clients/public', $paths['public_upload_url']);

        return [
            'dir' => $dir,
            'url' => $url ?: '/backend/uploads/clients/public',
        ];
    }

    return [
        'dir' => $paths['public_upload_dir'],
        'url' => $paths['public_upload_url'],
    ];
}

function ensure_upload_dirs(string $bucket = 'works'): void
{
    $dir = upload_bucket_paths($bucket)['dir'];

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

function uploaded_files_from_field(array $field): array
{
    if (!isset($field['name'])) {
        return [];
    }

    if (!is_array($field['name'])) {
        return (($field['error'] ?? UPLOAD_ERR_NO_FILE) === UPLOAD_ERR_NO_FILE) ? [] : [$field];
    }

    $files = [];

    foreach ($field['name'] as $index => $name) {
        if (($field['error'][$index] ?? UPLOAD_ERR_NO_FILE) === UPLOAD_ERR_NO_FILE) {
            continue;
        }

        $files[] = [
            'error' => $field['error'][$index],
            'full_path' => $field['full_path'][$index] ?? $name,
            'name' => $name,
            'size' => $field['size'][$index],
            'tmp_name' => $field['tmp_name'][$index],
            'type' => $field['type'][$index],
        ];
    }

    return $files;
}

function slug_part(string $value): string
{
    $slug = strtolower(trim(preg_replace('/[^a-zA-Z0-9]+/', '-', $value), '-'));
    return $slug ?: 'work';
}

function image_processing_options(array $input): array
{
    $crop = $input['crop'] ?? 'preserve';
    $validCrops = [
        'preserve' => null,
        'square' => 1,
        'landscape' => 4 / 3,
        'wide' => 16 / 9,
        'portrait' => 3 / 4,
    ];

    if (!array_key_exists($crop, $validCrops)) {
        $crop = 'preserve';
    }

    $alignX = $input['align_x'] ?? 'center';
    $alignY = $input['align_y'] ?? 'middle';

    if (!in_array($alignX, ['left', 'center', 'right'], true)) {
        $alignX = 'center';
    }

    if (!in_array($alignY, ['top', 'middle', 'bottom'], true)) {
        $alignY = 'middle';
    }

    $rotate = (int) ($input['rotate'] ?? 0);
    $validRotations = [0, 90, 180, 270];

    if (!in_array($rotate, $validRotations, true)) {
        $rotate = 0;
    }

    return [
        'align_x' => $alignX,
        'align_y' => $alignY,
        'brightness' => max(-35, min(35, (int) ($input['brightness'] ?? 0))),
        'contrast' => max(-35, min(35, (int) ($input['contrast'] ?? 0))),
        'crop' => $crop,
        'crop_ratio' => $validCrops[$crop],
        'rotate' => $rotate,
        'saturation' => max(-35, min(35, (int) ($input['saturation'] ?? 0))),
    ];
}

function process_featured_work_image(array $file, string $title, array $options = []): string
{
    return process_public_image($file, $title, $options, 'works', true);
}

function process_client_logo_image(array $file, string $title, array $options = []): string
{
    return process_public_image($file, $title, $options, 'clients', false);
}

function process_public_image(array $file, string $title, array $options = [], string $bucket = 'works', bool $watermark = true): string
{
    ensure_upload_dirs($bucket);
    uploaded_image_is_valid($file);

    $paths = upload_bucket_paths($bucket);
    $base = slug_part($title) . '-' . bin2hex(random_bytes(6));
    $publicPath = $paths['dir'] . '/' . $base . '.webp';
    $sourcePath = $file['tmp_name'];
    $processing = image_processing_options($options);
    $processing['watermark'] = $watermark;

    if (extension_loaded('imagick')) {
        image_to_webp_with_imagick($sourcePath, $publicPath, $processing);
    } else {
        image_to_webp_with_gd($sourcePath, $publicPath, $processing);
    }

    if (!is_file($publicPath)) {
        throw new RuntimeException('Unable to create WebP image.');
    }

    return rtrim($paths['url'], '/') . '/' . basename($publicPath);
}

function delete_public_work_image(string $imageUrl): void
{
    delete_public_image($imageUrl, 'works');
}

function delete_public_client_image(string $imageUrl): void
{
    delete_public_image($imageUrl, 'clients');
}

function delete_public_image(string $imageUrl, string $bucket = 'works'): void
{
    $config = app_config();
    $filename = basename(parse_url($imageUrl, PHP_URL_PATH) ?: '');

    if (!$filename || $filename === '.' || $filename === '..') {
        return;
    }

    $path = rtrim(upload_bucket_paths($bucket)['dir'], '/') . '/' . $filename;

    if (is_file($path)) {
        unlink($path);
    }
}

function crop_box_for_ratio(int $width, int $height, float $ratio, string $alignX, string $alignY): array
{
    $currentRatio = $width / $height;

    if ($currentRatio > $ratio) {
        $cropHeight = $height;
        $cropWidth = (int) round($height * $ratio);
    } else {
        $cropWidth = $width;
        $cropHeight = (int) round($width / $ratio);
    }

    if ($alignX === 'left') {
        $x = 0;
    } elseif ($alignX === 'right') {
        $x = $width - $cropWidth;
    } else {
        $x = (int) round(($width - $cropWidth) / 2);
    }

    if ($alignY === 'top') {
        $y = 0;
    } elseif ($alignY === 'bottom') {
        $y = $height - $cropHeight;
    } else {
        $y = (int) round(($height - $cropHeight) / 2);
    }

    return [$x, $y, $cropWidth, $cropHeight];
}

function image_to_webp_with_imagick(string $source, string $destination, array $options): void
{
    $config = app_config()['images'];
    $image = new Imagick($source);
    $image->autoOrient();

    if ($options['rotate']) {
        $image->rotateImage(new ImagickPixel('transparent'), $options['rotate']);
    }

    if ($options['crop_ratio']) {
        [$x, $y, $cropWidth, $cropHeight] = crop_box_for_ratio(
            $image->getImageWidth(),
            $image->getImageHeight(),
            (float) $options['crop_ratio'],
            $options['align_x'],
            $options['align_y']
        );
        $image->cropImage($cropWidth, $cropHeight, $x, $y);
        $image->setImagePage(0, 0, 0, 0);
    }

    $width = $image->getImageWidth();

    if ($width > $config['max_width']) {
        $image->resizeImage($config['max_width'], 0, Imagick::FILTER_LANCZOS, 1);
    }

    if ($options['brightness'] || $options['saturation']) {
        $image->modulateImage(
            100 + (int) $options['brightness'],
            100 + (int) $options['saturation'],
            100
        );
    }

    if ($options['contrast'] !== 0) {
        $image->brightnessContrastImage(0, (int) $options['contrast']);
    }

    if (!empty($options['watermark'])) {
        $draw = new ImagickDraw();
        $draw->setFillColor(new ImagickPixel('rgba(255,255,255,0.32)'));
        $draw->setFontSize(max(18, (int) round($image->getImageWidth() / 42)));
        $draw->setGravity(Imagick::GRAVITY_SOUTHEAST);
        $image->annotateImage($draw, 34, 26, 0, $config['watermark_text']);
    }
    $image->setImageFormat('webp');
    $image->setImageCompressionQuality((int) $config['webp_quality']);
    $image->writeImage($destination);
    $image->clear();
}

function image_to_webp_with_gd(string $source, string $destination, array $options): void
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

    if ($options['rotate']) {
        $rotated = imagerotate($src, 360 - (int) $options['rotate'], imagecolorallocatealpha($src, 0, 0, 0, 127));
        imagedestroy($src);
        $src = $rotated;
        $width = imagesx($src);
        $height = imagesy($src);
    }

    $srcX = 0;
    $srcY = 0;
    $srcWidth = $width;
    $srcHeight = $height;

    if ($options['crop_ratio']) {
        [$srcX, $srcY, $srcWidth, $srcHeight] = crop_box_for_ratio(
            $width,
            $height,
            (float) $options['crop_ratio'],
            $options['align_x'],
            $options['align_y']
        );
    }

    $targetWidth = min((int) $config['max_width'], $srcWidth);
    $targetHeight = (int) round($srcHeight * ($targetWidth / $srcWidth));
    $dst = imagecreatetruecolor($targetWidth, $targetHeight);
    imagealphablending($dst, true);
    imagesavealpha($dst, true);
    imagecopyresampled($dst, $src, 0, 0, $srcX, $srcY, $targetWidth, $targetHeight, $srcWidth, $srcHeight);

    if ($options['brightness'] !== 0) {
        imagefilter($dst, IMG_FILTER_BRIGHTNESS, (int) $options['brightness']);
    }

    if ($options['contrast'] !== 0) {
        imagefilter($dst, IMG_FILTER_CONTRAST, -1 * (int) $options['contrast']);
    }

    if (!empty($options['watermark'])) {
        $fontSize = max(4, (int) round($targetWidth / 180));
        $text = $config['watermark_text'];
        $color = imagecolorallocatealpha($dst, 255, 255, 255, 76);
        $textWidth = imagefontwidth($fontSize) * strlen($text);
        $textHeight = imagefontheight($fontSize);
        imagestring($dst, $fontSize, $targetWidth - $textWidth - 28, $targetHeight - $textHeight - 24, $text, $color);
    }

    imagewebp($dst, $destination, (int) $config['webp_quality']);
    imagedestroy($src);
    imagedestroy($dst);
}
