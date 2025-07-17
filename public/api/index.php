<?php
// Load Composer's autoloader
require_once __DIR__ . '/../../vendor/autoload.php';
use Routes\AuthRoutes;
use Routes\AdminRoutes;

// Load environment variables
$projectRoot = dirname(__DIR__, 2);
$dotenv = Dotenv\Dotenv::createImmutable($projectRoot);
$dotenv->load();

$rawBody = json_decode(file_get_contents('php://input'), true) ?? [];
$headers = function_exists('getallheaders') ? getallheaders() : [];

$method = $_SERVER['REQUEST_METHOD'];
$path = strtok($_SERVER['REQUEST_URI'], '?');

if (strpos($path, '/api/Auth/') === 0) {
    // Auth routes do not require headers
    $input = $rawBody;
    AuthRoutes::handle($method, $path, $input);
    exit;
}

if (strpos($path, '/api/Admin/') === 0) {
    // Admin routes require headers
    $input = [
        'body' => $rawBody,
        'headers' => $headers,
    ];
    AdminRoutes::handle($method, $path, $input);
    exit;
}
// ... and so on for other route groups

// If no route matched
http_response_code(404);
echo json_encode(['status' => 'error', 'message' => 'Not found']);
