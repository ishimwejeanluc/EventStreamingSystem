<?php
// AdminRoutes.php
// This file defines the routes (URLs) for admin actions like event and video management.

namespace Routes;

use Controllers\Admin\EventController;
use Controllers\Admin\VideoController;

class AdminRoutes
{
    public static function handle($method, $path, $input)
    {
        $eventController = new EventController();
        $videoController = new VideoController();
        $authHeader = $input['headers']['Authorization'] ?? null;
        $token = null;
        if ($authHeader && str_starts_with($authHeader, 'Bearer ')) {
            $token = substr($authHeader, 7);
        }
        $body = $input['body'] ?? [];

        if ($method === 'POST' && $path === '/api/Admin/events') {
            $result = $eventController->createEvent($body, $token);
            echo json_encode($result);
            exit;
        }
        if ($method === 'POST' && $path === '/api/Admin/videos/upload') {
            $result = $videoController->createVideo($body, $token);
            echo json_encode($result);
            exit;
        }
        // Add more admin routes as needed

        http_response_code(404);
        echo json_encode(['status' => 'error', 'message' => 'Not found']);
    }
}