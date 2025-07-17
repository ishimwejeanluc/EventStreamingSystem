<?php
// VideoController.php
// This controller handles admin-only actions for videos, enforcing JWT and admin role checks.

namespace Controllers\Admin;

use Services\Admin\VideoService;
use Utils\Security;
use Utils\Enums\UserRole;
use Ramsey\Uuid\Uuid;
use Utils\Enums\VideoStatus;
use Models\Video;

class VideoController {
    private $videoService;

    public function __construct() {
        $this->videoService = new VideoService();
    }

    private function requireAdmin($token) {
        // Debug: Log the token
        error_log('Token received in requireAdmin: ' . $token);
        // Check if token is a valid JWT (three parts separated by dots)
        if (!$token || substr_count($token, '.') !== 2) {
            http_response_code(401);
            echo json_encode(['status' => 'error', 'message' => 'Invalid or missing JWT token.']);
            return null;
        }
        try {
            $payload = Security::verifyToken($token);
            $userData = $payload['data'] ?? null;
            if (!$userData || ($userData['role'] ?? null) !== UserRole::ADMIN->value) {
                http_response_code(403);
                echo json_encode(['status' => 'error', 'message' => 'Admin privileges required.']);
                return null;
            }
            return $userData;
        } catch (\Exception $e) {
            http_response_code(401);
            echo json_encode(['status' => 'error', 'message' => 'Invalid or expired token.']);
            return null;
        }
    }

    public function createVideo(array $data, $authHeader) {
        $user = $this->requireAdmin($authHeader);
        if (!$user) return;
        $id = Uuid::uuid4()->toString();
        $title = $data['title'] ;
        $filePath = $data['file_path'] ;
        $description = $data['description'];
        $thumbnailPath = $data['thumbnail_path'] ;
        $duration =  (int)$data['duration'] ;
        $createdBy = $user['id'];
        $updatedBy = $user['id'];
        if (!$title || !$filePath) {
            http_response_code(400);
            return ['status' => 'error', 'message' => 'Video title and file_path are required.'];
        }
        $video = new Video($id, $title, $filePath, $description, $thumbnailPath, $duration, $createdBy, $updatedBy);
        return $this->videoService->create($video);
    }
} 