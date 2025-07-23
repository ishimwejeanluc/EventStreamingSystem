<?php
namespace Routes;

use Controllers\Admin\EventController;
use Controllers\Admin\VideoController;
use Controllers\Admin\StatisticsController;

class AdminRoutes
{
    public static function handle($method, $path, $input)
    {
        $eventController = new EventController();
        $videoController = new VideoController();
        $statisticsController = new StatisticsController();

        // Extract token from Authorization header
        $authHeader = $input['headers']['Authorization'] ?? null;
        $token = null;
        if ($authHeader && str_starts_with($authHeader, 'Bearer ')) {
            $token = substr($authHeader, 7);
        }
        $body = $input['body'] ?? [];

        // --- Event Routes ---
        // Create Event
        if ($method === 'POST' && ($path === '/api/Admin/events' || $path === '/api/Admin/Event/createEvent')) {
            $result = $eventController->createEvent($body, $token);
            echo json_encode($result);
            exit;
        }
        // Get Single Event
        if ($method === 'GET' && preg_match('#^/api/Admin/events/([^/]+)$#', $path, $matches)) {
            $result = $eventController->getEvent($matches[1], $token);
            echo json_encode($result);
            exit;
        }
        // Update Event
        if ($method === 'PUT' && preg_match('#^/api/Admin/events/([^/]+)$#', $path, $matches)) {
            $result = $eventController->updateEvent($matches[1], $body, $token);
            echo json_encode($result);
            exit;
        }
        // Delete Event
        if ($method === 'DELETE' && preg_match('#^/api/Admin/events/([^/]+)$#', $path, $matches)) {
            $result = $eventController->deleteEvent($matches[1], $token);
            echo json_encode($result);
            exit;
        }
        // Get All Events
        if ($method === 'GET' && $path === '/api/Admin/events') {
            $result = $eventController->getAllEvents($token);
            echo json_encode($result);
            exit;
        }

        // --- Video Routes ---
        // Upload/Create Video
        if ($method === 'POST' && $path === '/api/Admin/videos/upload') {
            $result = $videoController->createVideo($body, $token);
            echo json_encode($result);
            exit;
        }
        // Get Single Video
        if ($method === 'GET' && preg_match('#^/api/Admin/videos/([^/]+)$#', $path, $matches)) {
            $result = $videoController->getVideo($matches[1], $token);
            echo json_encode($result);
            exit;
        }
        // Update Video
        if ($method === 'PUT' && preg_match('#^/api/Admin/videos/([^/]+)$#', $path, $matches)) {
            $result = $videoController->updateVideo($matches[1], $body, $token);
            echo json_encode($result);
            exit;
        }
        // Delete Video
        if ($method === 'DELETE' && preg_match('#^/api/Admin/videos/([^/]+)$#', $path, $matches)) {
            $result = $videoController->deleteVideo($matches[1], $token);
            echo json_encode($result);
            exit;
        }
        // Get All Videos
        if ($method === 'GET' && $path === '/api/Admin/videos') {
            $result = $videoController->getAllVideos($token);
            echo json_encode($result);
            exit;
        }

        // --- Statistics Routes ---
        // Get View Statistics
        if ($method === 'GET' && $path === '/api/Admin/statistics/views') {
            $result = $statisticsController->getViewStatistics($token);
            echo json_encode($result);
            exit;
        }
        // Get User Statistics
        if ($method === 'GET' && $path === '/api/Admin/statistics/users') {
            $result = $statisticsController->getUserStatistics($token);
            echo json_encode($result);
            exit;
        }
        // Get Event Statistics
        if ($method === 'GET' && $path === '/api/Admin/statistics/events') {
            $result = $statisticsController->getEventStatistics($token);
            echo json_encode($result);
            exit;
        }
        // Get Overall Statistics Dashboard
        if ($method === 'GET' && $path === '/api/Admin/statistics/dashboard') {
            $result = $statisticsController->getDashboardStatistics($token);
            echo json_encode($result);
            exit;
        }

        // --- 404 Not Found for unmatched routes ---
        http_response_code(404);
        echo json_encode(['status' => 'error', 'message' => 'Not found']);
    }
}