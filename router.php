<?php
// Local development router: php -S 127.0.0.1:8000 router.php
// Production Apache uses .htaccess; other hosts need equivalent configuration.
$path = rawurldecode(parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH) ?? '/');
if ($path === '/index.html') {
    header('Location: /' . (empty($_SERVER['QUERY_STRING']) ? '' : '?' . $_SERVER['QUERY_STRING']), true, 301);
    exit;
}
if ($path === '/') {
    header('Content-Type: text/html; charset=utf-8');
    readfile(__DIR__ . '/index.html');
    exit;
}
$file = realpath(__DIR__ . $path);
if (!preg_match('~(?:^|/)\.~', $path) && $file !== false &&
    str_starts_with($file, __DIR__ . DIRECTORY_SEPARATOR) && is_file($file)) {
    return false;
}
http_response_code(404);
header('Content-Type: text/html; charset=utf-8');
readfile(__DIR__ . '/404.html');
