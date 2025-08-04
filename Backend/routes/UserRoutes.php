<?php
namespace Routes;

use Controllers\UserController;

class UserRoutes
{
    public static function handle($method, $path, $input)
    {
        $userController = new UserController();

        // Extract token from Authorization header
        $authHeader = $input['headers']['Authorization'] ?? null;
        $token = null;
        if ($authHeader && str_starts_with($authHeader, 'Bearer ')) {
            $token = substr($authHeader, 7);
        }
        $body = $input['body'] ?? [];

        // --- User Profile Routes ---
        // Get User Profile
        if ($method === 'GET' && preg_match('#^/api/users/([^/]+)/profile$#', $path, $matches)) {
            $result = $userController->getProfile($matches[1], $token);
            echo json_encode($result);
            exit;
        }

        // Update User Profile
        if ($method === 'PUT' && preg_match('#^/api/users/([^/]+)/profile$#', $path, $matches)) {
            $result = $userController->updateProfile($matches[1], $body, $token);
            echo json_encode($result);
            exit;
        }

        // Deactivate Account
        if ($method === 'POST' && preg_match('#^/api/users/([^/]+)/deactivate$#', $path, $matches)) {
            $result = $userController->deactivateAccount($matches[1], $token);
            echo json_encode($result);
            exit;
        }

        // --- Video Interaction Routes ---
        // Play Video
        if ($method === 'POST' && preg_match('#^/api/users/play/([^/]+)$#', $path, $matches)) {
            $result = $userController->playVideo($matches[1], $token);
            echo json_encode($result);
            exit;
        }

        // Watch History
        if ($method === 'GET' && $path === '/api/users/watchhistory') {
            $result = $userController->getWatchHistory($token);
            echo json_encode($result);
            exit;
        }

        // Events
        if ($method === 'GET' && $path === '/api/users/events') {
            $result = $userController->getAllEvents($token);
            echo json_encode($result);
            exit;
        }

        // --- 404 Not Found for unmatched routes ---
        http_response_code(404);
        echo json_encode(['status' => 'error', 'message' => 'Not found']);
    }
}
