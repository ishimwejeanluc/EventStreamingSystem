<?php
require_once __DIR__ . '/../../vendor/autoload.php';
// Main API entry point
header('Content-Type: application/json');

$path = $_SERVER['REQUEST_URI'];

// Route to Auth
if (strpos($path, '/api/Auth/') === 0) {
    require_once __DIR__ . '/../../routes/AuthRoutes.php';
    exit;
}

// Add more routes for other controllers here

http_response_code(404);
echo json_encode(['status' => 'error', 'message' => 'Not found']);
