<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}
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


// If no route matched
http_response_code(404);
echo json_encode(['status' => 'error', 'message' => 'Not found']);