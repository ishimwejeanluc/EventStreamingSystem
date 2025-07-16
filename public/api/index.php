<?php
// Load Composer's autoloader
require_once __DIR__ . '/../../vendor/autoload.php';

// Load environment variables
$projectRoot = dirname(__DIR__, 2);
$dotenv = Dotenv\Dotenv::createImmutable($projectRoot);
$dotenv->load();

// Gather request info
$method = $_SERVER['REQUEST_METHOD'];
$path = strtok($_SERVER['REQUEST_URI'], '?');
$input = json_decode(file_get_contents('php://input'), true);

if (strpos($path, '/api/Auth/') === 0) {
    Routes\AuthRoutes::handle($method, $path, $input);
    exit;
}
if (strpos($path, '/api/User/') === 0) {
    Routes\UserRoutes::handle($method, $path, $input);
    exit;
}
// ... and so on for other route groups

// If no route matched
http_response_code(404);
echo json_encode(['status' => 'error', 'message' => 'Not found']);
